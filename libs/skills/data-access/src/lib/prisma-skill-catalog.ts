import { Injectable } from '@nestjs/common';
import { PrismaService } from '@skillforge/platform-database';
import { SkillCatalog, SkillSummary } from '@skillforge/skills-application';

@Injectable()
export class PrismaSkillCatalog implements SkillCatalog {
  constructor(private readonly prisma: PrismaService) {}

  list(): Promise<readonly SkillSummary[]> {
    return this.prisma.skill.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
  }
}
