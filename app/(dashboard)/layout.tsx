'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const mobileNavigation = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transações' },
  { href: '/categories', label: 'Categorias' },
  { href: '/settings', label: 'Configurações' }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    if (!hydrated && !isRestoring) {
      void restoreSession();
    }
  }, [hydrated, isRestoring, restoreSession]);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace('/login');
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || isRestoring) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface-panel px-8 py-6 text-sm text-muted-foreground">Restaurando sessão...</div>
      </main>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen text-foreground lg:grid lg:grid-cols-[268px_1fr]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="relative min-h-screen">
        <Header />

        <nav className="relative z-10 flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-[4px] border px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-premium',
                  isActive
                    ? 'border-primary/40 bg-primary/20 text-foreground'
                    : 'border-transparent bg-card text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="container relative z-10 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
