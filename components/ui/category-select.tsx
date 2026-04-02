'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BriefcaseBusiness,
  Car,
  ChevronDown,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  ShoppingCart,
  Tag,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  allowEmpty?: boolean;
  className?: string;
  disabled?: boolean;
}

const categoryIconMap = {
  wallet: Wallet,
  'shopping-cart': ShoppingCart,
  car: Car,
  home: Home,
  'heart-pulse': HeartPulse,
  'briefcase-business': BriefcaseBusiness,
  'graduation-cap': GraduationCap,
  laptop: Laptop,
  plane: Plane,
  tag: Tag
} as const;

export function CategorySelect({
  categories,
  value,
  onChange,
  placeholder = 'Selecione uma categoria',
  emptyLabel = 'Categorias',
  allowEmpty = false,
  className,
  disabled = false
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === value),
    [categories, value]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = containerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const renderCategory = (category?: Category | null) => {
    const Icon = categoryIconMap[category?.icon as keyof typeof categoryIconMap] ?? Tag;

    return (
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-secondary/70">
          <Icon className="h-3.5 w-3.5" style={{ color: category?.color || '#9CA3AF' }} />
        </span>
        <span className="truncate">{category?.name || placeholder}</span>
      </span>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative', open && 'z-[70]', className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-input bg-secondary/80 px-3.5 text-left text-sm text-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon/45 disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-primary/45'
        )}
        onClick={() => setOpen((current) => !current)}
      >
        {selectedCategory ? (
          renderCategory(selectedCategory)
        ) : allowEmpty && value === '' ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-secondary/70">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <span>{emptyLabel}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}

        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && mounted
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[120] max-h-72 overflow-auto rounded-2xl border border-border bg-card/95 p-2 shadow-soft-xl backdrop-blur-xl"
              style={{
                top: menuStyle.top,
                left: menuStyle.left,
                width: menuStyle.width
              }}
            >
              {allowEmpty ? (
                <button
                  type="button"
                  className={cn(
                    'mb-1 flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm transition-colors',
                    value === ''
                      ? 'border-primary/40 bg-primary/15 text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground'
                  )}
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                  }}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-secondary/70">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  {emptyLabel}
                </button>
              ) : null}

              {categories.map((category) => {
                const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap] ?? Tag;
                const isSelected = category.id === value;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={cn(
                      'mb-1 flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm transition-colors last:mb-0',
                      isSelected
                        ? 'border-primary/40 bg-primary/15 text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground'
                    )}
                    onClick={() => {
                      onChange(category.id);
                      setOpen(false);
                    }}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-secondary/70">
                      <Icon className="h-3.5 w-3.5" style={{ color: category.color }} />
                    </span>
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
