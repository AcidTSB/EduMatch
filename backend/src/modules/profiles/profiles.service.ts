import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, profileData: any) {
    return await this.prisma.profile.create({
      data: {
        userId,
        ...profileData,
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            subscriptionType: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateData: any) {
    const profile = await this.findByUserId(userId);
    
    return await this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  }

  async searchProfiles(searchQuery: string, role?: string) {
    const where: any = {};
    
    if (role) {
      where.user = { role };
    }

    if (searchQuery) {
      where.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { bio: { contains: searchQuery, mode: 'insensitive' } },
        { skills: { hasSome: [searchQuery] } },
        { interests: { hasSome: [searchQuery] } },
      ];
    }

    return await this.prisma.profile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }
}
