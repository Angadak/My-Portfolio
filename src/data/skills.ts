import { z } from 'zod';
import { skillSchema } from '@/lib/schemas';

export const skills = z.array(skillSchema).parse([
  { name: 'C#', group: 'backend', since: 2022, usedIn: ['Edenred', 'TRIS', 'CWECS', 'AEPartners'] },
  { name: 'ASP.NET Core / Web API', group: 'backend', since: 2023, usedIn: ['TRIS', 'Edenred', 'AEPartners'] },
  { name: 'Entity Framework Core', group: 'backend', since: 2023, usedIn: ['TRIS', 'Edenred'] },
  { name: 'Blazor', group: 'backend', since: 2024, usedIn: ['Edenred'] },
  { name: 'Node.js / Express', group: 'backend', since: 2023, usedIn: ['Moowr', 'ClaimsToExcel'] },
  { name: 'TypeScript', group: 'frontend', since: 2024, usedIn: ['AEPartners'] },
  { name: 'Svelte 5', group: 'frontend', since: 2026, usedIn: ['AEPartners'] },
  { name: 'JavaScript', group: 'frontend', since: 2022, usedIn: ['MRM', 'TRIS', 'CWECS'] },
  { name: 'HTML / CSS / Tailwind', group: 'frontend', since: 2022, usedIn: ['MRM', 'AEPartners'] },
  { name: 'Azure', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'Docker', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'CI/CD (Azure DevOps, GitHub)', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'SQL Server', group: 'data', since: 2023, usedIn: ['Edenred', 'TRIS'] },
  { name: 'MySQL', group: 'data', since: 2023, usedIn: ['TRIS', 'CWECS', 'Moowr'] },
  { name: 'Git', group: 'tools', since: 2022, usedIn: ['All projects'] },
  { name: 'Visual Studio / VS Code', group: 'tools', since: 2022, usedIn: ['All projects'] },
  { name: 'Swagger / OpenAPI', group: 'tools', since: 2023, usedIn: ['TRIS', 'CWECS'] },
]);
