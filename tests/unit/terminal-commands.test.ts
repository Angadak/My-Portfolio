import { describe, expect, it } from 'vitest';
import { complete, runCommand } from '@/lib/terminal/commands';
import type { SiteIndex } from '@/lib/site';

const ctx: SiteIndex = {
  nav: [],
  caseStudies: [
    { slug: 'practice-manager', title: 'Practice manager' },
    { slug: 'tris', title: 'TRIS' },
  ],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'Angad Kumar · Full-stack engineer · 4.5+ years',
  status: '● Open to remote roles worldwide',
  skills: ['Backend         C#, ASP.NET Core'],
};

describe('runCommand', () => {
  it('ignores empty input', () => {
    expect(runCommand('   ', ctx)).toEqual({ lines: [] });
  });

  it('lists commands on help', () => {
    const { lines } = runCommand('help', ctx);
    expect(lines[0]).toBe('Available commands:');
    expect(lines.some((l) => l.includes('sudo hire-me'))).toBe(true);
  });

  it('is case and whitespace insensitive', () => {
    expect(runCommand('  WhoAmI ', ctx).lines).toEqual([ctx.whoami]);
  });

  it('lists and opens case studies', () => {
    expect(runCommand('work', ctx).lines.join('\n')).toContain('practice-manager');
    expect(runCommand('work tris', ctx).effect).toEqual({ type: 'navigate', href: '/work/tris' });
    expect(runCommand('work nope', ctx).effect).toBeUndefined();
  });

  it('has navigation, download, clear and close effects', () => {
    expect(runCommand('contact', ctx).effect).toEqual({ type: 'navigate', href: '/contact' });
    expect(runCommand('sudo hire-me', ctx).effect).toEqual({ type: 'navigate', href: '/contact' });
    expect(runCommand('cv', ctx).effect).toEqual({ type: 'download', href: '/cv.pdf' });
    expect(runCommand('clear', ctx).effect).toEqual({ type: 'clear' });
    expect(runCommand('exit', ctx).effect).toEqual({ type: 'close' });
  });

  it('says when there are no posts', () => {
    expect(runCommand('blog', ctx)).toEqual({ lines: ['No posts published yet.'] });
  });

  it('suggests help for unknown commands', () => {
    expect(runCommand('rm -rf /', ctx).lines[0]).toBe("command not found: rm. Type 'help'.");
  });
});

describe('complete', () => {
  it('completes known commands by prefix', () => {
    expect(complete('wh')).toEqual(['whoami']);
    expect(complete('c')).toEqual(['contact', 'cv', 'clear']);
    expect(complete('')).toEqual([]);
  });
});
