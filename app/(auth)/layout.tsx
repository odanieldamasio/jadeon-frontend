import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="surface-panel page-enter w-full max-w-md p-8">{children}</div>
    </main>
  );
}
