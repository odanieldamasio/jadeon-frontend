import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-2xl border border-transparent text-sm font-semibold tracking-tight text-primary-foreground transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon/45',
  {
    variants: {
      variant: {
        default:
          'bg-[linear-gradient(135deg,#22C55E_0%,#4ADE80_50%,#86EFAC_100%)] text-[#04110a] shadow-green-glow hover:border-primary-neon/55',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:border-primary/35',
        outline:
          'border-input bg-card/85 text-foreground hover:border-primary/45',
        ghost: 'text-muted-foreground hover:border-primary/35 hover:text-foreground',
        danger: 'bg-danger text-white hover:border-danger/50'
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-10 px-4',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
