'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Conta</p>
        <h2 className="text-sm font-semibold sm:text-base">{user?.name || user?.email || 'Usuario'}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline">Plano {planLabel[user?.planType ?? 'FREE']}</Badge>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
