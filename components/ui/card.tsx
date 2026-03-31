import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'surface-subtle group relative overflow-hidden transition-colors duration-200 ease-premium hover:border-primary/40',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mb-0 flex items-center justify-between border-b border-border/65 px-5 py-4 sm:px-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-semibold tracking-tight text-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-7', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
