export interface SkillSummary {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

export interface SkillCatalog {
  list(): Promise<readonly SkillSummary[]>;
}

export const SKILL_CATALOG = Symbol('SKILL_CATALOG');
