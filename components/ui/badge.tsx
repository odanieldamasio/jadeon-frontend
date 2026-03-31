import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
  variants: {
    variant: {
      default: 'border-transparent bg-secondary text-secondary-foreground',
      success: 'border-success/40 bg-card text-success',
      danger: 'border-danger/40 bg-card text-danger',
      outline: 'border-input bg-card text-muted-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
}
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
