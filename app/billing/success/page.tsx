'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Settings, LayoutDashboard } from 'lucide-react';
import { Suspense, useEffect, useRef } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { useValidateCheckoutFlow } from '@/lib/hooks/use-user';
import { cn } from '@/lib/utils';

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const validateCheckoutFlow = useValidateCheckoutFlow();
  const hasStartedValidation = useRef(false);
  const flowToken = searchParams.get('flowToken');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (hasStartedValidation.current) {
      return;
    }
    hasStartedValidation.current = true;

    if (!flowToken || !sessionId) {
      return;
    }

    validateCheckoutFlow.mutate(
      {
        flowToken,
        sessionId,
        outcome: 'success'
      },
      {
        onError: () => {
          // Validation is best-effort and should not block this public page.
        }
      }
    );
  }, [flowToken, sessionId, validateCheckoutFlow]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-40" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-64 w-64 rounded-full bg-primary-neon/20 blur-3xl" />

      <section className="surface-panel neon-outline page-enter w-full max-w-xl space-y-6 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/45 bg-primary/15">
          <CheckCircle2 className="h-8 w-8 text-primary-neon" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Pagamento confirmado</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Seu plano foi atualizado com sucesso. Agora voce ja pode usar todos os recursos liberados.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/dashboard" className={cn(buttonVariants(), 'w-full')}>
            <LayoutDashboard className="h-4 w-4" />
            Ir para dashboard
          </Link>
          <Link href="/settings" className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
            <Settings className="h-4 w-4" />
            Ver assinatura
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BillingSuccessContent />
    </Suspense>
  );
}
