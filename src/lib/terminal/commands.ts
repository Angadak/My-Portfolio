import type { SiteIndex } from '@/lib/site';

export type CommandEffect =
  | { type: 'navigate'; href: string }
  | { type: 'download'; href: string }
  | { type: 'clear' }
  | { type: 'close' };

export type CommandResult = { lines: string[]; effect?: CommandEffect };

const HELP: [string, string][] = [
  ['help', 'show this list'],
  ['whoami', 'who I am'],
  ['status', 'availability'],
  ['skills', 'skills by area'],
  ['work [name]', 'list or open case studies'],
  ['blog', 'latest notes'],
  ['contact', 'open the contact page'],
  ['cv', 'download my CV'],
  ['clear', 'clear the screen'],
  ['exit', 'close the terminal'],
  ['sudo hire-me', 'you know what this does'],
];

export const COMMANDS = ['help', 'whoami', 'status', 'skills', 'work', 'blog', 'contact', 'cv', 'clear', 'exit', 'sudo hire-me'];

export function runCommand(raw: string, ctx: SiteIndex): CommandResult {
  const input = raw.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!input) return { lines: [] };
  if (input === 'sudo hire-me') {
    return { lines: ['Permission granted. Opening the contact page…'], effect: { type: 'navigate', href: '/contact' } };
  }
  const [command, ...args] = input.split(' ');

  switch (command) {
    case 'help':
      return { lines: ['Available commands:', ...HELP.map(([name, description]) => `  ${name.padEnd(14)}${description}`)] };
    case 'whoami':
      return { lines: [ctx.whoami] };
    case 'status':
      return { lines: [ctx.status] };
    case 'skills':
      return { lines: ctx.skills };
    case 'work': {
      const slug = args[0];
      if (!slug) {
        return {
          lines: [...ctx.caseStudies.map((c) => `  ${c.slug.padEnd(26)}${c.title}`), "Type 'work <name>' to open one."],
        };
      }
      const study = ctx.caseStudies.find((c) => c.slug === slug);
      return study
        ? { lines: [`Opening ${study.title}…`], effect: { type: 'navigate', href: `/work/${study.slug}` } }
        : { lines: [`No case study called '${slug}'. Type 'work' to list them.`] };
    }
    case 'blog':
      return ctx.posts.length
        ? { lines: ctx.posts.slice(0, 5).map((p) => `  ${p.title}`), effect: { type: 'navigate', href: '/blog' } }
        : { lines: ['No posts published yet.'] };
    case 'contact':
      return { lines: [`Email: ${ctx.email}`, 'Opening the contact page…'], effect: { type: 'navigate', href: '/contact' } };
    case 'cv':
      return { lines: ['Downloading CV…'], effect: { type: 'download', href: ctx.cvHref } };
    case 'clear':
      return { lines: [], effect: { type: 'clear' } };
    case 'exit':
      return { lines: [], effect: { type: 'close' } };
    default:
      return { lines: [`command not found: ${command}. Type 'help'.`] };
  }
}

export function complete(prefix: string): string[] {
  const p = prefix.trim().toLowerCase();
  if (!p) return [];
  return COMMANDS.filter((c) => c.startsWith(p));
}
