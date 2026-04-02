'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderKanban, LayoutDashboard, Settings, Wallet } from 'lucide-react';
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
      <div className="mb-8 px-3 py-2.5">
        <Image
          src="/jadeon-logo.svg"
          alt="Jadeon"
          width={65}
          height={41}
          className="h-auto w-[65px]"
          priority
        />
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
