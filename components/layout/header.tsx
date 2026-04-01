'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const planLabel: Record<string, string> = {
  FREE: 'Free',
  ESSENTIAL: 'Essential',
  PREMIUM: 'Premium'
};

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-neon">Conta</p>
        <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          {user?.name || user?.email || 'Usuário'}
        </h2>
      </div>

      <div className="flex items-center gap-2.5">
        <Badge variant="outline" className="border-border bg-secondary/85">
          Plano {planLabel[user?.planType ?? 'FREE']}
        </Badge>
        <Link href="/transactions?modal=nova" className={cn(buttonVariants({ size: 'sm' }))}>
          Nova transação
        </Link>
        <Button variant="outline" size="sm" className="bg-secondary/85" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
