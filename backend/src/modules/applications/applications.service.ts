import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, scholarshipId: string, applicationData: any) {
    // Check if scholarship exists and is active
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    if (scholarship.applicationDeadline < new Date()) {
      throw new BadRequestException('Application deadline has passed');
    }

    // Check if user already applied
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        applicantId: userId,
        scholarshipId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this scholarship');
    }

    return await this.prisma.application.create({
      data: {
        applicantId: userId,
        scholarshipId,
        ...applicationData,
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        scholarship: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
        applicant: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return await this.prisma.application.findMany({
      where: { applicantId: userId },
      include: {
        scholarship: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findByScholarship(scholarshipId: string, providerId?: string) {
    // If providerId is provided, verify ownership
    if (providerId) {
      const scholarship = await this.prisma.scholarship.findUnique({
        where: { id: scholarshipId },
      });

      if (!scholarship || scholarship.providerId !== providerId) {
        throw new NotFoundException('Scholarship not found or not authorized');
      }
    }

    return await this.prisma.application.findMany({
      where: { scholarshipId },
      include: {
        applicant: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        scholarship: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
        applicant: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    providerId?: string,
    feedback?: string
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        scholarship: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Verify provider ownership if providerId is provided
    if (providerId && application.scholarship.providerId !== providerId) {
      throw new BadRequestException('Not authorized to update this application');
    }

    return await this.prisma.application.update({
      where: { id },
      data: {
        status,
        feedback,
        reviewedAt: new Date(),
      },
      include: {
        scholarship: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
        applicant: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async withdraw(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.applicantId !== userId) {
      throw new BadRequestException('Not authorized to withdraw this application');
    }

    if (application.status !== ApplicationStatus.SUBMITTED) {
      throw new BadRequestException('Cannot withdraw application in current status');
    }

    return await this.prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.REJECTED, // Use REJECTED instead of WITHDRAWN
      },
    });
  }

  async getApplicationStats(scholarshipId?: string, userId?: string) {
    const where: any = {};
    
    if (scholarshipId) {
      where.scholarshipId = scholarshipId;
    }
    
    if (userId) {
      where.applicantId = userId;
    }

    const [total, submitted, underReview, accepted, rejected, waitlisted] = await Promise.all([
      this.prisma.application.count({ where }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.SUBMITTED } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.UNDER_REVIEW } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.ACCEPTED } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.REJECTED } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.WAITLISTED } }),
    ]);

    return {
      total,
      submitted,
      underReview,
      accepted,
      rejected,
      waitlisted,
    };
  }

  async findPendingApplications(providerId: string) {
    const scholarships = await this.prisma.scholarship.findMany({
      where: { providerId },
      select: { id: true },
    });

    const scholarshipIds = scholarships.map(s => s.id);

    return await this.prisma.application.findMany({
      where: {
        scholarshipId: { in: scholarshipIds },
        status: {
          in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW],
        },
      },
      include: {
        scholarship: true,
        applicant: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });
  }
}
