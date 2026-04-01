'use client';

import { CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils/finance';
import type { DashboardSummary } from '@/types';

interface ChartsProps {
  summary: DashboardSummary;
}

const chartConfig = {
  income: {
    label: 'Entradas',
    color: '#4ade80'
  },
  expense: {
    label: 'Saídas',
    color: '#f87171'
  }
} satisfies ChartConfig;

const donutConfig = {
  income: {
    label: 'Entradas',
    color: '#4ade80'
  },
  expense: {
    label: 'Saídas',
    color: '#f87171'
  }
} satisfies ChartConfig;

export function Charts({ summary }: ChartsProps) {
  const hasSeriesData = summary.monthlySeries.length > 0;

  const pieData = [
    {
      key: 'income',
      value: summary.monthIncome,
      fill: 'var(--color-income)'
    },
    {
      key: 'expense',
      value: summary.monthExpense,
      fill: 'var(--color-expense)'
    }
  ];

  const hasPieData = pieData.some((item) => item.value > 0);

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card className="p-0">
          <CardHeader>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Fluxo mensal</p>
              <CardTitle className="text-sm font-semibold text-foreground">Evolução do caixa</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[292px] p-4 sm:p-5">
            {hasSeriesData ? (
              <ChartContainer config={chartConfig} className="h-full">
                <LineChart data={summary.monthlySeries} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={72}
                    tickFormatter={(value) => formatCurrency(Number(value))}
                  />
                  <ChartTooltip
                    cursor={{ stroke: 'rgba(34, 197, 94, 0.32)', strokeWidth: 1 }}
                    content={<ChartTooltipContent valueFormatter={(value) => formatCurrency(Number(value))} />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="var(--color-expense)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/70">
                <p className="text-sm font-medium text-foreground">Ainda sem movimentação</p>
                <p className="text-xs text-muted-foreground">As linhas aparecem assim que houver transações no período.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="p-0">
          <CardHeader>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Composição</p>
              <CardTitle className="text-sm font-semibold text-foreground">Entradas vs. saídas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[292px] p-4 sm:p-5">
            {hasPieData ? (
              <ChartContainer config={donutConfig} className="h-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel valueFormatter={(value) => formatCurrency(Number(value))} />}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="key"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={3}
                    cornerRadius={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={3}
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="key" />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/70">
                <p className="text-sm font-medium text-foreground">Sem distribuição no período</p>
                <p className="text-xs text-muted-foreground">Entradas e saídas aparecem aqui automaticamente.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
