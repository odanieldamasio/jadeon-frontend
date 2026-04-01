import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-40" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-64 w-64 rounded-full bg-primary-neon/20 blur-3xl" />
      <div className="surface-panel page-enter neon-outline w-full max-w-md p-8 sm:p-9">{children}</div>
    </main>
  );
}
