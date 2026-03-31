import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[4px] border border-border bg-muted',
        className
      )}
    />
  );
}

export { Skeleton };
