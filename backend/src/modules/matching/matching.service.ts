import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:5000');
  }

  async calculateMatchingScore(userId: string, scholarshipId: string) {
    try {
      // Get user profile and preferences
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      if (!user || !user.profile) {
        throw new Error('User profile not found');
      }

      // Get scholarship details
      const scholarship = await this.prisma.scholarship.findUnique({
        where: { id: scholarshipId },
      });

      if (!scholarship) {
        throw new Error('Scholarship not found');
      }

      // Prepare data for AI service
      const matchingData = {
        user_profile: {
          academic_major: user.profile.major,
          degree_level: user.profile.currentLevel,
          gpa: user.profile.gpa,
          research_interests: user.profile.interests,
          skills: user.profile.skills,
          achievements: user.profile.publications,
          experience_years: user.profile.experience,
          location: user.profile.currentLocation,
        },
        scholarship: {
          title: scholarship.title,
          description: scholarship.description,
          type: scholarship.type,
          university: scholarship.university,
          department: scholarship.department,
          required_degree: scholarship.requirements,
          required_gpa: scholarship.minGpa,
          required_skills: scholarship.requiredSkills,
          location: scholarship.location,
          tags: scholarship.tags,
          field_of_study: scholarship.tags[0] || 'general', // Use first tag as field
        },
      };

      // Call AI service for matching
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/match`, matchingData)
      );

      const { score, factors } = response.data;

      // Save matching score to database
      await this.prisma.matchingScore.upsert({
        where: {
          userId_scholarshipId: {
            userId,
            scholarshipId,
          },
        },
        update: {
          score,
          factors,
        },
        create: {
          userId,
          scholarshipId,
          score,
          factors,
        },
      });

      return { score, factors };
    } catch (error) {
      this.logger.error(`Error calculating matching score: ${error.message}`, error.stack);
      // Return default score if AI service is unavailable
      return { score: 0, factors: {} };
    }
  }

  async calculateBulkMatching(userId: string, scholarshipIds?: string[]) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      if (!user || !user.profile) {
        throw new Error('User profile not found');
      }

      let scholarships;
      if (scholarshipIds) {
        scholarships = await this.prisma.scholarship.findMany({
          where: {
            id: { in: scholarshipIds },
            isVisible: true,
          },
        });
      } else {
        // Get active scholarships
        scholarships = await this.prisma.scholarship.findMany({
          where: {
            isVisible: true,
            applicationDeadline: {
              gte: new Date(),
            },
          },
          take: 50, // Limit to prevent overload
        });
      }

      const matchingData = {
        user_profile: {
          academic_major: user.profile.major,
          degree_level: user.profile.currentLevel,
          gpa: user.profile.gpa,
          research_interests: user.profile.interests,
          skills: user.profile.skills,
          achievements: user.profile.publications,
          experience_years: user.profile.experience,
          location: user.profile.currentLocation,
        },
        scholarships: scholarships.map(scholarship => ({
          id: scholarship.id,
          title: scholarship.title,
          description: scholarship.description,
          type: scholarship.type,
          university: scholarship.university,
          department: scholarship.department,
          required_degree: scholarship.requiredDegree,
          required_gpa: scholarship.requiredGpa,
          required_skills: scholarship.requiredSkills,
          location: scholarship.location,
          tags: scholarship.tags,
          field_of_study: scholarship.fieldOfStudy,
        })),
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/match-bulk`, matchingData)
      );

      const results = response.data.results;

      // Save all matching scores
      for (const result of results) {
        await this.prisma.matchingScore.upsert({
          where: {
            userId_scholarshipId: {
              userId,
              scholarshipId: result.scholarship_id,
            },
          },
          update: {
            score: result.score,
            factors: result.factors,
          },
          create: {
            userId,
            scholarshipId: result.scholarship_id,
            score: result.score,
            factors: result.factors,
          },
        });
      }

      return results;
    } catch (error) {
      this.logger.error(`Error calculating bulk matching: ${error.message}`, error.stack);
      return [];
    }
  }

  async getRecommendations(userId: string, limit: number = 10) {
    try {
      // First try to get existing matching scores
      let matchingScores = await this.prisma.matchingScore.findMany({
        where: { userId },
        include: {
          scholarship: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: limit,
      });

      // If no matching scores exist or need refresh, calculate them
      if (matchingScores.length === 0) {
        await this.calculateBulkMatching(userId);
        
        matchingScores = await this.prisma.matchingScore.findMany({
          where: { userId },
          include: {
            scholarship: true,
          },
          orderBy: {
            score: 'desc',
          },
          take: limit,
        });
      }

      return matchingScores
        .filter(ms => ms.scholarship && ms.scholarship.isVisible && ms.scholarship.applicationDeadline >= new Date())
        .map(ms => ({
          ...ms.scholarship,
          matchingScore: ms.score,
          matchingFactors: ms.factors,
          calculatedAt: ms.createdAt, // Use createdAt instead of calculatedAt
        }));
    } catch (error) {
      this.logger.error(`Error getting recommendations: ${error.message}`, error.stack);
      
      // Fallback to basic recommendations
      return await this.prisma.scholarship.findMany({
        where: {
          isVisible: true,
          applicationDeadline: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });
    }
  }

  async updateUserMatchingPreferences(userId: string, preferences: any) {
    // For now, just store in profile or skip this feature
    // since matchingPreferences doesn't exist in schema
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date(), // Just update timestamp for now
      },
    });

    // Invalidate existing matching scores for recalculation
    await this.prisma.matchingScore.deleteMany({
      where: { userId },
    });

    this.logger.log(`Updated matching preferences for user ${userId}`);
  }

  async getMatchingStats(userId: string) {
    const stats = await this.prisma.matchingScore.aggregate({
      where: { userId },
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
      _max: {
        score: true,
      },
      _min: {
        score: true,
      },
    });

    const scoreDistribution = await this.prisma.matchingScore.groupBy({
      by: ['score'],
      where: { userId },
      _count: {
        score: true,
      },
    });

    return {
      averageScore: stats._avg.score || 0,
      totalCalculated: stats._count.score || 0,
      maxScore: stats._max.score || 0,
      minScore: stats._min.score || 0,
      scoreDistribution,
    };
  }

  async refreshMatchingScores(userId?: string) {
    const startTime = Date.now();
    
    try {
      if (userId) {
        // Refresh for specific user
        await this.calculateBulkMatching(userId);
        this.logger.log(`Refreshed matching scores for user ${userId}`);
      } else {
        // Refresh for all users (batch job)
        const users = await this.prisma.user.findMany({
          include: { profile: true },
          where: {
            profile: {
              isNot: null,
            },
          },
        });

        for (const user of users) {
          await this.calculateBulkMatching(user.id);
        }

        this.logger.log(`Refreshed matching scores for ${users.length} users`);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Matching score refresh completed in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Error refreshing matching scores: ${error.message}`, error.stack);
      throw error;
    }
  }
}
