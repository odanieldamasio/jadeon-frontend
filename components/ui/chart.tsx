'use client';

import * as React from 'react';
import {
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type LegendProps,
  type TooltipProps
} from 'recharts';
import { cn } from '@/lib/utils';

type ThemeName = 'light' | 'dark';

type ChartItemConfig = {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  theme?: Partial<Record<ThemeName, string>>;
};

export type ChartConfig = Record<string, ChartItemConfig>;

const themeSelectors: Record<ThemeName, string> = {
  light: '',
  dark: '.dark'
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart precisa ser usado dentro de <ChartContainer />');
  }

  return context;
}

function buildChartCss(chartId: string, config: ChartConfig) {
  const entries = Object.entries(config).filter(([, item]) => item.color || item.theme);

  if (!entries.length) {
    return '';
  }

  return (Object.entries(themeSelectors) as Array<[ThemeName, string]>)
    .map(([themeName, selectorPrefix]) => {
      const vars = entries
        .map(([key, item]) => {
          const color = item.theme?.[themeName] || item.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter((line): line is string => Boolean(line))
        .join('\n');

      if (!vars) {
        return null;
      }

      const selector = selectorPrefix
        ? `${selectorPrefix} [data-chart="${chartId}"]`
        : `[data-chart="${chartId}"]`;

      return `${selector} {\n${vars}\n}`;
    })
    .filter((line): line is string => Boolean(line))
    .join('\n');
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>['children'];
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, config, children, ...props }, ref) => {
    const uniqueId = React.useId().replace(/:/g, '');
    const chartId = `chart-${id || uniqueId}`;
    const css = buildChartCss(chartId, config);

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-chart={chartId}
          className={cn(
            'h-full w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/75 [&_.recharts-legend-item-text]:text-muted-foreground [&_.recharts-surface]:outline-none [&_.recharts-text]:fill-muted-foreground',
            className
          )}
          {...props}
        >
          {css ? <style>{css}</style> : null}
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);

ChartContainer.displayName = 'ChartContainer';

const ChartTooltip = RechartsTooltip;

type TooltipPayloadItem = NonNullable<TooltipProps<number | string, string>['payload']>[number];

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  payload?: TooltipProps<number | string, string>['payload'];
  label?: TooltipProps<number | string, string>['label'];
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'dot' | 'line';
  nameKey?: string;
  valueFormatter?: (value: number | string, name: string) => React.ReactNode;
  labelFormatter?: (label: TooltipProps<number | string, string>['label']) => React.ReactNode;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = 'dot',
      nameKey,
      valueFormatter,
      labelFormatter,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    const renderedLabel = labelFormatter ? labelFormatter(label) : label;

    return (
      <div
        ref={ref}
        className={cn(
          'min-w-[168px] rounded-2xl border border-border bg-card/95 px-4 py-3 text-xs shadow-soft-xl backdrop-blur-lg',
          className
        )}
        {...props}
      >
        {!hideLabel && renderedLabel ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {renderedLabel}
          </p>
        ) : null}

        <div className="space-y-1.5">
          {payload.map((item, index) => {
            const payloadItem = item as TooltipPayloadItem;
            const rawPayload = payloadItem.payload as Record<string, unknown> | undefined;
            const configKey = nameKey
              ? String(rawPayload?.[nameKey] ?? payloadItem.dataKey ?? payloadItem.name ?? index)
              : String(payloadItem.dataKey ?? payloadItem.name ?? index);

            const itemConfig = config[configKey] || config[String(payloadItem.name ?? '')];
            const itemName = itemConfig?.label || String(payloadItem.name ?? configKey);
            const rawValue = payloadItem.value ?? 0;
            const color =
              (payloadItem as { color?: string }).color ||
              (payloadItem as { fill?: string }).fill ||
              `var(--color-${configKey})`;

            return (
              <div key={`${configKey}-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!hideIndicator ? (
                    indicator === 'line' ? (
                      <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: color }} />
                    ) : (
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    )
                  ) : null}
                  <span className="text-muted-foreground">{itemName}</span>
                </div>

                <span className="font-semibold text-foreground">
                  {valueFormatter ? valueFormatter(rawValue, itemName) : rawValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = RechartsLegend;

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: LegendProps['payload'];
  nameKey?: string;
  hideIcon?: boolean;
}

function ChartLegendContent({ payload, className, nameKey, hideIcon = false }: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-4 pt-3 text-xs font-medium text-muted-foreground',
        className
      )}
    >
      {payload.map((item, index) => {
        const key = String(item.dataKey ?? item.value ?? index);
        const configKey = nameKey ? String((item.payload as Record<string, unknown> | undefined)?.[nameKey] ?? key) : key;
        const itemConfig = config[configKey] || config[String(item.value ?? '')];
        const Icon = itemConfig?.icon;
        const color = item.color || `var(--color-${configKey})`;

        return (
          <div key={`${configKey}-${index}`} className="flex items-center gap-1.5 text-muted-foreground">
            {!hideIcon ? (
              Icon ? (
                <Icon className="h-3 w-3" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              )
            ) : null}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent };
