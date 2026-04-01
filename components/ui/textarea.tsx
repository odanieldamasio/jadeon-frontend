import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-32 w-full rounded-xl border border-input bg-secondary/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/85 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon/45 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
