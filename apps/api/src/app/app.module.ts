import { Module } from '@nestjs/common';
import { DatabaseModule } from '@skillforge/platform-database';
import { SkillsApiModule } from '@skillforge/skills-api';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, HealthModule, SkillsApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
