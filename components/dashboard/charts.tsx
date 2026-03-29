'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts';
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
    color: '#0f766e'
  },
  expense: {
    label: 'Saidas',
    color: '#ef4444'
  }
} satisfies ChartConfig;

const donutConfig = {
  income: {
    label: 'Entradas',
    color: '#14b8a6'
  },
  expense: {
    label: 'Saidas',
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
      <Card className="lg:col-span-3 rounded-lg border border-border/80 bg-card p-0 shadow-none">
        <CardHeader className="mb-0 border-b border-border/70 px-5 py-4">
          <CardTitle className="text-sm font-semibold text-foreground">Evolucao do Mes</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] p-4">
          {hasSeriesData ? (
            <ChartContainer config={chartConfig} className="h-full">
              <BarChart data={summary.monthlySeries} barGap={8} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
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
                  cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }}
                  content={<ChartTooltipContent valueFormatter={(value) => formatCurrency(Number(value))} />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={[5, 5, 0, 0]} maxBarSize={26} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={[5, 5, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">Sem dados para exibir no periodo.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 rounded-lg border border-border/80 bg-card p-0 shadow-none">
        <CardHeader className="mb-0 border-b border-border/70 px-5 py-4">
          <CardTitle className="text-sm font-semibold text-foreground">Entradas vs Saidas</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] p-4">
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
                  cornerRadius={6}
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                />
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">Sem entradas ou saidas no periodo.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
