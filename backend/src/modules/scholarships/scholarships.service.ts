import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ScholarshipType, ScholarshipStatus } from '@prisma/client';

@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip?: number, take?: number, filters?: any) {
    const where: any = { isVisible: true };

    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.university) {
      where.university = { contains: filters.university, mode: 'insensitive' };
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    return await this.prisma.scholarship.findMany({
      skip,
      take: take || 20,
      where,
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    // Increment view count
    await this.prisma.scholarship.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return scholarship;
  }

  async create(providerId: string, data: any) {
    return await this.prisma.scholarship.create({
      data: {
        providerId,
        ...data,
        status: ScholarshipStatus.DRAFT,
      },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async update(id: string, providerId: string, data: any) {
    // Verify ownership
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    if (scholarship.providerId !== providerId) {
      throw new Error('Not authorized to update this scholarship');
    }

    return await this.prisma.scholarship.update({
      where: { id },
      data,
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async delete(id: string, providerId: string) {
    // Verify ownership
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    if (scholarship.providerId !== providerId) {
      throw new Error('Not authorized to delete this scholarship');
    }

    return await this.prisma.scholarship.delete({
      where: { id },
    });
  }

  async findByProvider(providerId: string) {
    return await this.prisma.scholarship.findMany({
      where: { providerId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async searchWithRecommendations(userId: string, query?: string, filters?: any) {
    // First get regular search results
    const scholarships = await this.findAll(0, 50, { ...filters, search: query });

    // If user is logged in, get matching scores
    if (userId) {
      const matchingScores = await this.prisma.matchingScore.findMany({
        where: {
          userId,
          scholarshipId: {
            in: scholarships.map(s => s.id),
          },
        },
      });

      // Attach matching scores to scholarships
      return scholarships.map(scholarship => {
        const matchingScore = matchingScores.find(ms => ms.scholarshipId === scholarship.id);
        return {
          ...scholarship,
          matchingScore: matchingScore?.score || 0,
          matchingFactors: matchingScore?.factors || {},
        };
      }).sort((a, b) => (b.matchingScore || 0) - (a.matchingScore || 0));
    }

    return scholarships;
  }
}
