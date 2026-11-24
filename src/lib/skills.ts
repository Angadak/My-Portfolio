import type { Skill, SkillGroup } from './schemas';

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  cloud: 'Cloud & DevOps',
  data: 'Data',
  tools: 'Tools',
};

export type SkillWithYears = Skill & { years: number };
export type SkillGroupView = { group: SkillGroup; label: string; skills: SkillWithYears[] };

export function groupSkills(skills: Skill[], now: Date = new Date()): SkillGroupView[] {
  return (Object.keys(SKILL_GROUP_LABELS) as SkillGroup[])
    .map((group) => ({
      group,
      label: SKILL_GROUP_LABELS[group],
      skills: skills
        .filter((s) => s.group === group)
        .map((s) => ({ ...s, years: Math.max(1, now.getFullYear() - s.since) }))
        .sort((a, b) => b.years - a.years),
    }))
    .filter((g) => g.skills.length > 0);
}
