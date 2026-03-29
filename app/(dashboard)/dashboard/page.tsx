'use client';

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
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-[300px]" />
      </section>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <div className="glass-panel p-6 text-danger">
        Nao foi possivel carregar os dados do dashboard agora.
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <SummaryCards
        currentBalance={summaryQuery.data.currentBalance}
        monthIncome={summaryQuery.data.monthIncome}
        monthExpense={summaryQuery.data.monthExpense}
      />

      <Charts summary={summaryQuery.data} />

      <Card className="rounded-lg border border-border/80 bg-card p-0 shadow-none">
        <CardHeader className="mb-0 border-b border-border/70 px-5 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold text-foreground">Ultimas transacoes</CardTitle>
            <Link
              href="/transactions"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver mais
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentQuery.isLoading ? (
            <div className="space-y-2 px-5 py-4">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : recentQuery.data?.length ? (
            <div>
              {recentQuery.data.map((transaction) => {
                const isExpense = transaction.type === 'EXPENSE';
                const formattedAmount = formatCurrency(Math.abs(parseAmount(transaction.amount)));

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[0.95rem] font-semibold text-foreground">{transaction.description}</p>
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
            <p className="px-5 py-4 text-sm text-muted-foreground">Sem transacoes recentes.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
