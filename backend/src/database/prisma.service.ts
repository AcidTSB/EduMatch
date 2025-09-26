import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }

  // Helper method for transactions
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return await this.$transaction(fn);
  }

  // Soft delete helper
  async softDelete(model: string, where: any) {
    return await (this as any)[model].update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Restore soft deleted record
  async restore(model: string, where: any) {
    return await (this as any)[model].update({
      where,
      data: {
        deletedAt: null,
      },
    });
  }
}
