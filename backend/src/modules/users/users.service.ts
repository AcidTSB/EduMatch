import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip?: number, take?: number) {
    return await this.prisma.user.findMany({
      skip,
      take,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async findByFirebaseUid(firebaseUid: string) {
    return await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        profile: true,
      },
    });
  }

  async createFromFirebase(firebaseUser: any) {
    const user = await this.prisma.user.create({
      data: {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        emailVerified: firebaseUser.email_verified,
        role: UserRole.STUDENT, // Default role
        status: UserStatus.ACTIVE,
        profile: {
          create: {
            firstName: firebaseUser.name?.split(' ')[0] || '',
            lastName: firebaseUser.name?.split(' ').slice(1).join(' ') || '',
            avatar: firebaseUser.picture,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user;
  }

  async updateUser(id: string, data: any) {
    const user = await this.findById(id);
    
    return await this.prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
      },
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    return await this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserStats() {
    const totalUsers = await this.prisma.user.count();
    const studentCount = await this.prisma.user.count({
      where: { role: UserRole.STUDENT },
    });
    const providerCount = await this.prisma.user.count({
      where: { role: UserRole.PROVIDER },
    });
    const activeUsers = await this.prisma.user.count({
      where: { status: UserStatus.ACTIVE },
    });

    return {
      total: totalUsers,
      students: studentCount,
      providers: providerCount,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
    };
  }
}
