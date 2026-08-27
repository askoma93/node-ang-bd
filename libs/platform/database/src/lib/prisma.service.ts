import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const DATABASE_URL = Symbol('DATABASE_URL');

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(DATABASE_URL) databaseUrl: string) {
    super({ datasources: { db: { url: databaseUrl } } });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
    } catch {
      this.logger.warn('Database is unavailable during startup');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
