import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
    iconClassName: 'bg-primary/12 text-primary',
    valueClassName: 'text-foreground'
  },
  {
    key: 'month-income',
    title: 'Entradas no Mes',
    icon: TrendingUp,
    iconClassName: 'bg-success/12 text-success',
    valueClassName: 'text-success'
  },
  {
    key: 'month-expense',
    title: 'Saidas no Mes',
    icon: TrendingDown,
    iconClassName: 'bg-danger/12 text-danger',
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
          <Card
            key={item.key}
            className={cn(
              'rounded-lg border border-border/80 bg-card p-0 shadow-none page-enter',
              index === 1 ? '[animation-delay:70ms]' : '',
              index === 2 ? '[animation-delay:120ms]' : ''
            )}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span
                className={cn(
                  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/70',
                  item.iconClassName
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="space-y-0.5">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <p className={cn('text-[1.75rem] font-bold leading-none', item.valueClassName)}>
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
