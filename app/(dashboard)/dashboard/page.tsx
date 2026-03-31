'use client';

import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Charts } from '@/components/dashboard/charts';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { useCategories } from '@/lib/hooks/use-categories';
import { useDashboardSummary } from '@/lib/hooks/use-dashboard';
import { useRecentTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency, formatDate, parseAmount } from '@/lib/utils/finance';

export default function DashboardPage() {
  const summaryQuery = useDashboardSummary();
  const recentQuery = useRecentTransactions(5);
  const categoriesQuery = useCategories();

  const categoriesMap = new Map((categoriesQuery.data || []).map((item) => [item.id, item.name]));

  if (summaryQuery.isLoading) {
    return (
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-[4px]" />
          <Skeleton className="h-32 rounded-[4px]" />
          <Skeleton className="h-32 rounded-[4px]" />
        </div>
        <Skeleton className="h-[304px] rounded-[4px]" />
      </section>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <div className="surface-panel p-6 text-danger">
        Não foi possível carregar os dados do dashboard agora.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Visão geral</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[2rem]">Dashboard financeiro</h1>
          <p className="text-sm text-muted-foreground">Fluxo de caixa e atividade recente do seu MEI em tempo real.</p>
        </div>
      </div>

      <SummaryCards
        currentBalance={summaryQuery.data.currentBalance}
        monthIncome={summaryQuery.data.monthIncome}
        monthExpense={summaryQuery.data.monthExpense}
      />

      <Charts summary={summaryQuery.data} />

      <div>
        <Card className="p-0">
          <CardHeader className="mb-0 border-b border-border px-5 py-4 sm:px-6">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Atividade recente</p>
                <CardTitle className="text-sm font-semibold text-foreground">Últimas transações</CardTitle>
              </div>
              <Link
                href="/transactions"
                className="rounded-[4px] border border-border bg-card px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Ver mais
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentQuery.isLoading ? (
              <div className="space-y-2.5 px-5 py-4 sm:px-6">
                <Skeleton className="h-14 rounded-[4px]" />
                <Skeleton className="h-14 rounded-[4px]" />
              </div>
            ) : recentQuery.data?.length ? (
              <div>
                {recentQuery.data.map((transaction) => {
                  const isExpense = transaction.type === 'EXPENSE';
                  const formattedAmount = formatCurrency(Math.abs(parseAmount(transaction.amount)));

                  return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 transition-colors hover:bg-muted last:border-b-0 sm:px-6"
                  >
                      <div className="min-w-0">
                        <p className="truncate text-[0.95rem] font-semibold tracking-tight text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {categoriesMap.get(transaction.categoryId) || 'Sem categoria'} - {formatDate(transaction.date)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={isExpense ? 'text-sm font-semibold text-danger' : 'text-sm font-semibold text-success'}>
                          {isExpense ? '- ' : '+ '}
                          {formattedAmount}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 px-5 py-8 text-center sm:px-6">
                <Inbox className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Sem transações recentes.</p>
                <p className="text-xs text-muted-foreground">As novas movimentações aparecerão aqui automaticamente.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
