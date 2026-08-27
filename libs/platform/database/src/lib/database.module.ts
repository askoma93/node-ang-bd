import { Module } from '@nestjs/common';
import { loadDatabaseConfig } from '@skillforge/platform-config';
import { DatabaseReadiness } from './database-readiness.service';
import { DATABASE_URL, PrismaService } from './prisma.service';

@Module({
  providers: [
    {
      provide: DATABASE_URL,
      useFactory: () => loadDatabaseConfig(process.env).url,
    },
    PrismaService,
    DatabaseReadiness,
  ],
  exports: [PrismaService, DatabaseReadiness],
})
export class DatabaseModule {}
