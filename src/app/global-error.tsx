'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>The page failed to load. Please try again.</p>
        <button type="button" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
