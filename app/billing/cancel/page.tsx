'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircleX, RefreshCw, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { useValidateCheckoutFlow } from '@/lib/hooks/use-user';
import { cn } from '@/lib/utils';

export default function BillingCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const validateCheckoutFlow = useValidateCheckoutFlow();
  const [isValidated, setIsValidated] = useState(false);
  const hasStartedValidation = useRef(false);
  const flowToken = searchParams.get('flowToken');

  useEffect(() => {
    if (hasStartedValidation.current) {
      return;
    }
    hasStartedValidation.current = true;

    if (!flowToken) {
      router.replace('/dashboard');
      return;
    }

    validateCheckoutFlow
      .mutateAsync({
        flowToken,
        outcome: 'cancel'
      })
      .then(() => {
        setIsValidated(true);
      })
      .catch(() => {
        router.replace('/dashboard');
      });
  }, [flowToken, router, validateCheckoutFlow]);

  if (!isValidated) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-40" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-64 w-64 rounded-full bg-primary-neon/20 blur-3xl" />

      <section className="surface-panel page-enter w-full max-w-xl space-y-6 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
          <CircleX className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagamento cancelado</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Nenhuma cobranca foi concluida. Voce pode revisar os dados e tentar novamente quando quiser.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/settings" className={cn(buttonVariants(), 'w-full')}>
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
            <Settings className="h-4 w-4" />
            Voltar ao sistema
          </Link>
        </div>
      </section>
    </main>
  );
}
