import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function HomePage() {
  return (
    <div className="grid min-h-dvh place-items-center gap-6">
      <p className="word-emboss text-8xl font-black">BACKEND</p>
      <ThemeToggle />
    </div>
  );
}
