'use client';

import { BarChart3, LogOut, Menu, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const clearSession = useAuthStore((state) => state.clearSession);
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <div className="relative min-h-screen text-foreground lg:grid lg:grid-cols-[292px_1fr]">
      <div className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-30" />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="relative min-h-screen">
        <div className="hidden lg:block">
          <Header />
        </div>

        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/40 bg-[linear-gradient(135deg,#22C55E_0%,#4ADE80_50%,#86EFAC_100%)] text-[#04110a] shadow-green-glow">
                <BarChart3 className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-neon">Jadeon</span>
            </Link>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="rounded-xl border border-border bg-secondary/85 p-2 text-foreground transition-colors hover:border-primary/40"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMobileMenuOpen ? (
            <div className="mt-3 space-y-3 rounded-2xl border border-border bg-card/90 p-3 shadow-soft">
              <div className="rounded-xl border border-border bg-secondary/60 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Conta</p>
                <p className="text-sm font-medium text-foreground">{user?.name || user?.email || 'Usuário'}</p>
              </div>

              <nav className="grid gap-2">
                {mobileNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ease-premium',
                        isActive
                          ? 'border-primary/40 bg-primary/20 text-foreground shadow-green-glow'
                          : 'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid gap-2">
                <Link href="/transactions?modal=nova" className={cn(buttonVariants({ size: 'sm' }))}>
                  <Plus className="mr-1 h-4 w-4" />
                  Nova transação
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          ) : null}
        </header>

        <main className="container relative z-10 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
