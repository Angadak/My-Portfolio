import { profileSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';

export const profile = guardFillIns(
  profileSchema.parse({
    name: 'Angad Kumar',
    headline: 'Full-stack engineer (.NET + TypeScript)',
    location: '[fill-in: location line, e.g. India · open to remote worldwide]',
    availability: 'Open to remote roles worldwide',
    email: 'angad.ak70@gmail.com',
    github: 'https://github.com/Angadak',
    linkedin: '[fill-in: correct LinkedIn profile URL]',
    careerStart: '2022-04',
  }),
  'src/data/profile.ts',
);
