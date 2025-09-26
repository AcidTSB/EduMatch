import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // User management
  async getAllUsers(skip?: number, take?: number, filters?: any) {
    const where: any = {};
    
    if (filters?.role) {
      where.role = filters.role;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { profile: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { profile: { lastName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    return await this.prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: {
          select: {
            scholarships: true,
            applications: true,
            notifications: true,
          },
        },
      },
      skip,
      take: take || 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        scholarships: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        applications: {
          take: 10,
          include: { scholarship: true },
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            scholarships: true,
            applications: true,
            notifications: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(id: string, status: UserStatus) {
    return await this.prisma.user.update({
      where: { id },
      data: { status },
      include: { profile: true },
    });
  }

  async updateUserRole(id: string, role: UserRole) {
    return await this.prisma.user.update({
      where: { id },
      data: { role },
      include: { profile: true },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  // Scholarship management
  async getAllScholarships(skip?: number, take?: number, filters?: any) {
    const where: any = {};
    
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
        { university: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.scholarship.findMany({
      where,
      include: {
        provider: {
          include: { profile: true },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      skip,
      take: take || 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateScholarshipVisibility(id: string, isVisible: boolean) {
    return await this.prisma.scholarship.update({
      where: { id },
      data: { isVisible },
      include: {
        provider: { include: { profile: true } },
      },
    });
  }

  async deleteScholarship(id: string) {
    return await this.prisma.scholarship.delete({
      where: { id },
    });
  }

  // Application management
  async getAllApplications(skip?: number, take?: number, filters?: any) {
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.scholarshipId) {
      where.scholarshipId = filters.scholarshipId;
    }

    return await this.prisma.application.findMany({
      where,
      include: {
        applicant: { include: { profile: true } },
        scholarship: {
          include: { provider: { include: { profile: true } } },
        },
      },
      skip,
      take: take || 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // System statistics
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalScholarships,
      activeScholarships,
      totalApplications,
      pendingApplications,
      recentUsers,
      recentScholarships,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.scholarship.count(),
      this.prisma.scholarship.count({ 
        where: { 
          isVisible: true,
          applicationDeadline: { gte: new Date() },
        } 
      }),
      this.prisma.application.count(),
      this.prisma.application.count({ 
        where: { 
          status: { in: ['SUBMITTED', 'UNDER_REVIEW'] },
        } 
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { profile: true },
      }),
      this.prisma.scholarship.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { provider: { include: { profile: true } } },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        recent: recentUsers,
      },
      scholarships: {
        total: totalScholarships,
        active: activeScholarships,
        recent: recentScholarships,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
      },
    };
  }

  async getUserStats() {
    const [totalUsers, usersByRole, usersByStatus, usersByMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.user.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.user.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);

    return {
      total: totalUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {}),
      byStatus: usersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      byMonth: usersByMonth,
    };
  }

  async getScholarshipStats() {
    const [
      totalScholarships,
      scholarshipsByType,
      scholarshipsByStatus,
      scholarshipsByUniversity,
    ] = await Promise.all([
      this.prisma.scholarship.count(),
      this.prisma.scholarship.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.scholarship.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.scholarship.groupBy({
        by: ['university'],
        _count: { university: true },
        orderBy: { _count: { university: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      total: totalScholarships,
      byType: scholarshipsByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {}),
      byStatus: scholarshipsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      topUniversities: scholarshipsByUniversity,
    };
  }

  async getApplicationStats() {
    const [totalApplications, applicationsByStatus, applicationsByMonth] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.application.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);

    return {
      total: totalApplications,
      byStatus: applicationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      byMonth: applicationsByMonth,
    };
  }

  // System settings
  async getSystemSettings() {
    return await this.prisma.systemSettings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateSystemSetting(key: string, value: string) {
    return await this.prisma.systemSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // Bulk operations
  async bulkUpdateUserStatus(userIds: string[], status: UserStatus) {
    return await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { status },
    });
  }

  async bulkDeleteUsers(userIds: string[]) {
    return await this.prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
  }

  async bulkUpdateScholarshipVisibility(scholarshipIds: string[], isVisible: boolean) {
    return await this.prisma.scholarship.updateMany({
      where: { id: { in: scholarshipIds } },
      data: { isVisible },
    });
  }

  // Export data
  async exportUsers(format: 'csv' | 'json' = 'csv') {
    const users = await this.prisma.user.findMany({
      include: { profile: true },
    });

    if (format === 'json') {
      return users;
    }

    // Convert to CSV format
    const headers = ['ID', 'Email', 'Role', 'Status', 'First Name', 'Last Name', 'Created At'];
    const csvData = users.map(user => [
      user.id,
      user.email,
      user.role,
      user.status,
      user.profile?.firstName || '',
      user.profile?.lastName || '',
      user.createdAt.toISOString(),
    ]);

    return { headers, data: csvData };
  }

  async exportScholarships(format: 'csv' | 'json' = 'csv') {
    const scholarships = await this.prisma.scholarship.findMany({
      include: {
        provider: { include: { profile: true } },
        _count: { select: { applications: true } },
      },
    });

    if (format === 'json') {
      return scholarships;
    }

    const headers = ['ID', 'Title', 'University', 'Type', 'Status', 'Provider', 'Applications', 'Created At'];
    const csvData = scholarships.map(scholarship => [
      scholarship.id,
      scholarship.title,
      scholarship.university,
      scholarship.type,
      scholarship.status,
      `${scholarship.provider.profile?.firstName || ''} ${scholarship.provider.profile?.lastName || ''}`,
      scholarship._count.applications,
      scholarship.createdAt.toISOString(),
    ]);

    return { headers, data: csvData };
  }
}
