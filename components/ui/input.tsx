import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-input bg-secondary/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/85 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon/45 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
