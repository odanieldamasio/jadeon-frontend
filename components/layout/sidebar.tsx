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
    label: 'Transacoes',
    icon: Wallet
  },
  {
    href: '/categories',
    label: 'Categorias',
    icon: FolderKanban
  },
  {
    href: '/settings',
    label: 'Configuracoes',
    icon: Settings
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-border/80 bg-card/90 p-5 backdrop-blur">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Kontavo</p>
          <h1 className="text-lg font-bold">Finance OS</h1>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
