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
  { href: '/transactions', label: 'Transacoes' },
  { href: '/categories', label: 'Categorias' },
  { href: '/settings', label: 'Configuracoes' }
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
      <main className="flex min-h-screen items-center justify-center">
        <div className="glass-panel px-8 py-6 text-sm text-muted-foreground">Restaurando sessao...</div>
      </main>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="min-h-screen">
        <Header />

        <nav className="flex gap-2 overflow-x-auto border-b border-border/70 bg-card/40 px-4 py-2 lg:hidden">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="container py-6">{children}</main>
      </div>
    </div>
  );
}
