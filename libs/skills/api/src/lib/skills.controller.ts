import { Controller, Get, Inject } from '@nestjs/common';
import {
  SKILL_CATALOG,
  SkillCatalog,
  SkillSummary,
} from '@skillforge/skills-application';

interface SkillSummaryDto {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

function toSkillSummaryDto(skill: SkillSummary): SkillSummaryDto {
  return { id: skill.id, name: skill.name, slug: skill.slug };
}

@Controller('skills')
export class SkillsController {
  constructor(@Inject(SKILL_CATALOG) private readonly catalog: SkillCatalog) {}

  @Get()
  async list(): Promise<readonly SkillSummaryDto[]> {
    return (await this.catalog.list()).map(toSkillSummaryDto);
  }
}
