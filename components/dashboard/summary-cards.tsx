'use client';

import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/finance';

interface SummaryCardsProps {
  currentBalance: number;
  monthIncome: number;
  monthExpense: number;
}

const summaryConfig = [
  {
    key: 'current-balance',
    title: 'Saldo Atual',
    icon: WalletCards,
    iconClassName: 'border-primary/35 bg-primary/15 text-primary-neon',
    valueClassName: 'text-foreground'
  },
  {
    key: 'month-income',
    title: 'Entradas no Mês',
    icon: TrendingUp,
    iconClassName: 'border-success/30 bg-success/15 text-success',
    valueClassName: 'text-success'
  },
  {
    key: 'month-expense',
    title: 'Saídas no Mês',
    icon: TrendingDown,
    iconClassName: 'border-danger/30 bg-danger/15 text-danger',
    valueClassName: 'text-danger'
  }
] as const;

export function SummaryCards({ currentBalance, monthIncome, monthExpense }: SummaryCardsProps) {
  const values = [currentBalance, monthIncome, monthExpense];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summaryConfig.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="p-0">
            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
              <span
                className={
                  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ' +
                  item.iconClassName
                }
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.title}</p>
                <p className={'text-[1.78rem] font-bold leading-none tracking-tight ' + item.valueClassName}>
                  {formatCurrency(values[index])}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
