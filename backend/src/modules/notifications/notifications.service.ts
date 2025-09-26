import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ) {
    return await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {},
      },
    });
  }

  async findByUser(
    userId: string,
    skip?: number,
    take?: number,
    unreadOnly?: boolean
  ) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    return await this.prisma.notification.findMany({
      where,
      skip,
      take: take || 20,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    // Verify ownership
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found or not authorized');
    }

    return await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadCount(userId: string) {
    return await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async delete(id: string, userId: string) {
    // Verify ownership
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found or not authorized');
    }

    return await this.prisma.notification.delete({
      where: { id },
    });
  }

  // Helper methods to create specific notification types
  async notifyApplicationSubmitted(applicantId: string, scholarshipId: string, scholarshipTitle: string) {
    return await this.create(
      applicantId,
      'APPLICATION_STATUS',
      'Application Submitted',
      `Your application for "${scholarshipTitle}" has been submitted successfully.`,
      { scholarshipId, status: 'submitted' }
    );
  }

  async notifyApplicationStatusChanged(
    applicantId: string,
    scholarshipId: string,
    scholarshipTitle: string,
    status: string
  ) {
    const statusMessages = {
      'accepted': 'Congratulations! Your application has been accepted.',
      'rejected': 'Unfortunately, your application was not successful.',
      'under_review': 'Your application is now under review.',
      'waitlisted': 'Your application has been placed on the waiting list.',
    };

    return await this.create(
      applicantId,
      'APPLICATION_STATUS',
      `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      statusMessages[status] || `Your application status has been updated to ${status}.`,
      { scholarshipId, status }
    );
  }

  async notifyNewScholarship(userId: string, scholarshipId: string, scholarshipTitle: string) {
    return await this.create(
      userId,
      'NEW_SCHOLARSHIP',
      'New Scholarship Available',
      `A new scholarship "${scholarshipTitle}" matches your profile!`,
      { scholarshipId }
    );
  }

  async notifyDeadlineReminder(userId: string, scholarshipId: string, scholarshipTitle: string, daysLeft: number) {
    return await this.create(
      userId,
      'DEADLINE_REMINDER',
      'Application Deadline Approaching',
      `Only ${daysLeft} days left to apply for "${scholarshipTitle}".`,
      { scholarshipId, daysLeft }
    );
  }

  async notifyNewMessage(userId: string, senderId: string, senderName: string) {
    return await this.create(
      userId,
      'MESSAGE',
      'New Message',
      `You have a new message from ${senderName}.`,
      { senderId }
    );
  }

  async notifySystemUpdate(userId: string, title: string, message: string) {
    return await this.create(
      userId,
      'SYSTEM',
      title,
      message
    );
  }

  // Bulk notification methods
  async notifyMultipleUsers(userIds: string[], type: string, title: string, message: string, data?: any) {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      data: data || {},
    }));

    return await this.prisma.notification.createMany({
      data: notifications,
    });
  }

  async getNotificationStats(userId: string) {
    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: {
          type: true,
        },
      }),
    ]);

    return {
      total,
      unread,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {}),
    };
  }
}
