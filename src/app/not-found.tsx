import { PropIcon } from '@/components/props/props';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-3xl place-items-center px-4 py-24 text-center">
      <div className="w-32">
        <PropIcon name="mug" />
      </div>
      <p className="label mt-6 text-accent">404 / Not found</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">This page took a coffee break</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </div>
  );
}
