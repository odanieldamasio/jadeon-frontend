'use client';

import { CreditCard, ExternalLink, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateCheckout, useCreatePortal, useUserProfile } from '@/lib/hooks/use-user';
import { getErrorMessage } from '@/lib/utils/error';

const planLabel: Record<string, string> = {
  FREE: 'Free',
  ESSENTIAL: 'Essential',
  PREMIUM: 'Premium'
};

export default function SettingsPage() {
  const [billingError, setBillingError] = useState<string | null>(null);

  const userQuery = useUserProfile();
  const checkoutMutation = useCreateCheckout();
  const portalMutation = useCreatePortal();

  const handleCheckout = async (planType: 'ESSENTIAL' | 'PREMIUM') => {
    setBillingError(null);

    try {
      const response = await checkoutMutation.mutateAsync(planType);
      window.location.href = response.url;
    } catch (error) {
      setBillingError(getErrorMessage(error, 'Nao foi possivel iniciar checkout.'));
    }
  };

  const handlePortal = async () => {
    setBillingError(null);

    try {
      const response = await portalMutation.mutateAsync();
      window.location.href = response.url;
    } catch (error) {
      setBillingError(getErrorMessage(error, 'Nao foi possivel abrir portal de assinatura.'));
    }
  };

  if (userQuery.isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-40" />
      </section>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return <div className="glass-panel p-6 text-danger">Nao foi possivel carregar suas configuracoes.</div>;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">Ajuste perfil e assinatura da sua conta.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Dados do usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nome:</span> {userQuery.data.name}
          </p>
          <p>
            <span className="text-muted-foreground">E-mail:</span> {userQuery.data.email}
          </p>
          <p>
            <span className="text-muted-foreground">Telefone:</span> {userQuery.data.phone || 'Nao informado'}
          </p>
          <p>
            <span className="text-muted-foreground">Plano atual:</span> {planLabel[userQuery.data.planType]}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plano e cobranca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => handleCheckout('ESSENTIAL')}
              disabled={checkoutMutation.isPending}
            >
              Upgrade Essential
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCheckout('PREMIUM')}
              disabled={checkoutMutation.isPending}
            >
              Upgrade Premium
            </Button>
            <Button variant="default" onClick={handlePortal} disabled={portalMutation.isPending}>
              <ExternalLink className="mr-1 h-4 w-4" />
              Gerenciar assinatura
            </Button>
          </div>

          {billingError ? <p className="text-sm text-danger">{billingError}</p> : null}
        </CardContent>
      </Card>
    </section>
  );
}
