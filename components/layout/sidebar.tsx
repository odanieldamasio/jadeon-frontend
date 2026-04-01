'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FolderKanban, LayoutDashboard, Settings, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/transactions',
    label: 'Transações',
    icon: Wallet
  },
  {
    href: '/categories',
    label: 'Categorias',
    icon: FolderKanban
  },
  {
    href: '/settings',
    label: 'Configurações',
    icon: Settings
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r border-border/85 bg-background/80 p-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3 rounded-3xl border border-border bg-card/80 px-3 py-3 shadow-soft">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/40 bg-[linear-gradient(135deg,#22C55E_0%,#4ADE80_50%,#86EFAC_100%)] text-[#04110a] shadow-green-glow">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-neon">Jadeon</p>
          <h1 className="text-lg font-bold tracking-tight text-foreground">MEI Console</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-all duration-300 ease-premium',
                isActive
                  ? 'border-primary/40 bg-primary/20 text-foreground shadow-green-glow'
                  : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
