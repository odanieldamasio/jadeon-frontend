import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl border border-border bg-secondary/80',
        className
      )}
    />
  );
}

export { Skeleton };
