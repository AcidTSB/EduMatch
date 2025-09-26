import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, receiverId: string, content: string, attachments?: string[]) {
    // Verify that receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        attachments: attachments || [],
      },
      include: {
        sender: {
          include: { profile: true },
        },
        receiver: {
          include: { profile: true },
        },
      },
    });

    return message;
  }

  async getConversation(userId: string, otherUserId: string, skip?: number, take?: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          include: { profile: true },
        },
        receiver: {
          include: { profile: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: take || 50,
    });

    // Mark messages as read for the current user
    await this.markMessagesAsRead(userId, otherUserId);

    return messages.reverse(); // Return in chronological order
  }

  async getConversations(userId: string) {
    // Get all unique conversations for the user
    const sentMessages = await this.prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedMessages = await this.prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    // Get unique user IDs from both sent and received messages
    const userIds = [
      ...new Set([
        ...sentMessages.map(m => m.receiverId),
        ...receivedMessages.map(m => m.senderId),
      ]),
    ];

    // Get conversation details with latest message
    const conversations = await Promise.all(
      userIds.map(async (otherUserId) => {
        const latestMessage = await this.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { include: { profile: true } },
            receiver: { include: { profile: true } },
          },
        });

        const unreadCount = await this.prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        });

        const otherUser = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          include: { profile: true },
        });

        return {
          otherUser,
          latestMessage,
          unreadCount,
        };
      })
    );

    return conversations
      .filter(conv => conv.latestMessage)
      .sort((a, b) => new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime());
  }

  async markMessagesAsRead(userId: string, senderId: string) {
    return await this.prisma.message.updateMany({
      where: {
        senderId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId !== userId) {
      throw new BadRequestException('Not authorized to mark this message as read');
    }

    return await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new BadRequestException('Not authorized to delete this message');
    }

    return await this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  async getUnreadCount(userId: string) {
    return await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  async searchMessages(userId: string, query: string, skip?: number, take?: number) {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: take || 20,
    });
  }

  async getMessageById(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new BadRequestException('Not authorized to view this message');
    }

    return message;
  }

  async getMessageStats(userId: string) {
    const [sent, received, unread] = await Promise.all([
      this.prisma.message.count({ where: { senderId: userId } }),
      this.prisma.message.count({ where: { receiverId: userId } }),
      this.prisma.message.count({ 
        where: { 
          receiverId: userId, 
          isRead: false 
        } 
      }),
    ]);

    return {
      sent,
      received,
      unread,
      total: sent + received,
    };
  }

  // Real-time messaging helpers
  async getRecentContacts(userId: string, limit: number = 10) {
    const recentMessages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit * 2, // Get more to filter unique contacts
    });

    // Extract unique contacts
    const contacts = new Map();
    for (const message of recentMessages) {
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      if (!contacts.has(otherUser.id)) {
        contacts.set(otherUser.id, {
          user: otherUser,
          lastMessageAt: message.createdAt,
        });
      }
    }

    return Array.from(contacts.values())
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      .slice(0, limit);
  }
}
