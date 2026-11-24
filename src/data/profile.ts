import { profileSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';

export const profile = guardFillIns(
  profileSchema.parse({
    name: 'Angad Kumar',
    headline: 'Full-stack engineer (.NET + TypeScript)',
    location: 'New Delhi, India',
    availability: 'Open to remote roles worldwide',
    email: 'angad.ak70@gmail.com',
    github: 'https://github.com/Angadak',
    linkedin: 'https://www.linkedin.com/in/angad-kumar',
    careerStart: '2022-04',
  }),
  'src/data/profile.ts',
);
