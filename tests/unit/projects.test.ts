import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import { getProjects } from '@/lib/content';

function tempProjects(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'projects-'));
  for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body);
  return dir;
}

const project = (status: string, order: number) => `---
title: Demo ${order}
status: ${status}
repoUrl: https://github.com/Angadak/demo-${order}
stack: [C#]
summary: Demo.
order: ${order}
---
Body.`;

describe('getProjects', () => {
  it('returns only live projects by default, sorted by order', () => {
    const dir = tempProjects({ 'b.mdx': project('live', 2), 'a.mdx': project('live', 1), 'c.mdx': project('building', 0) });
    expect(getProjects(dir).map((p) => p.slug)).toEqual(['a', 'b']);
    expect(getProjects(dir, { liveOnly: false })).toHaveLength(3);
  });

  it('is empty when the folder does not exist yet', () => {
    expect(getProjects()).toEqual([]);
  });
});
