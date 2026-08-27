import { Module } from '@nestjs/common';
import { DatabaseModule } from '@skillforge/platform-database';
import { SKILL_CATALOG } from '@skillforge/skills-application';
import { PrismaSkillCatalog } from '@skillforge/skills-data-access';
import { SkillsController } from './skills.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SkillsController],
  providers: [{ provide: SKILL_CATALOG, useClass: PrismaSkillCatalog }],
})
export class SkillsApiModule {}
