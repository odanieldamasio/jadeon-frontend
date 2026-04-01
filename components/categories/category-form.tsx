'use client';

import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  Car,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  ShoppingCart,
  Tag,
  Wallet
} from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, CreateCategoryPayload } from '@/types';

const CATEGORY_COLORS = [
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#EF4444',
  '#14B8A6',
  '#22C55E',
  '#A855F7',
  '#06B6D4'
] as const;

const CATEGORY_ICON_OPTIONS = [
  { value: 'wallet', label: 'Carteira', icon: Wallet },
  { value: 'shopping-cart', label: 'Compras', icon: ShoppingCart },
  { value: 'car', label: 'Transporte', icon: Car },
  { value: 'home', label: 'Casa', icon: Home },
  { value: 'heart-pulse', label: 'Saúde', icon: HeartPulse },
  { value: 'briefcase-business', label: 'Trabalho', icon: BriefcaseBusiness },
  { value: 'graduation-cap', label: 'Estudos', icon: GraduationCap },
  { value: 'laptop', label: 'Tecnologia', icon: Laptop },
  { value: 'plane', label: 'Viagem', icon: Plane },
  { value: 'tag', label: 'Outros', icon: Tag }
] as const;

const CATEGORY_ICON_VALUES = CATEGORY_ICON_OPTIONS.map((item) => item.value) as [
  (typeof CATEGORY_ICON_OPTIONS)[number]['value'],
  ...(typeof CATEGORY_ICON_OPTIONS)[number]['value'][]
];

const schema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatório'),
  color: z.enum(CATEGORY_COLORS),
  icon: z.enum(CATEGORY_ICON_VALUES)
});

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  isPending?: boolean;
  onSubmit: (payload: CreateCategoryPayload) => Promise<void> | void;
}

const initialValues = {
  name: '',
  color: '#22C55E',
  icon: 'tag'
};

export function CategoryForm({
  open,
  onOpenChange,
  category,
  isPending,
  onSubmit
}: CategoryFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      const safeColor = CATEGORY_COLORS.includes(category.color as (typeof CATEGORY_COLORS)[number])
        ? category.color
        : initialValues.color;
      const safeIcon = CATEGORY_ICON_VALUES.includes(category.icon as (typeof CATEGORY_ICON_VALUES)[number])
        ? category.icon
        : initialValues.icon;

      setValues({
        name: category.name,
        color: safeColor,
        icon: safeIcon
      });
      return;
    }

    setValues(initialValues);
  }, [open, category]);

  const title = category ? 'Editar categoria' : 'Nova categoria';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        color: fieldErrors.color?.[0],
        icon: fieldErrors.icon?.[0]
      });
      return;
    }

    await onSubmit(parsed.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Crie categorias para organizar melhor seus registros.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(event) => {
                setValues((current) => ({ ...current, name: event.target.value }));
                setErrors((current) => ({ ...current, name: undefined }));
              }}
            />
            {errors.name ? <p className="text-xs text-danger/95">{errors.name}</p> : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Selecionar cor ${color}`}
                    className={[
                      'h-9 w-full rounded-xl border transition-all duration-200',
                      values.color === color ? 'border-primary-neon ring-2 ring-primary/35' : 'border-border'
                    ].join(' ')}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setValues((current) => ({ ...current, color }));
                      setErrors((current) => ({ ...current, color: undefined }));
                    }}
                  />
                ))}
              </div>
              {errors.color ? <p className="text-xs text-danger/95">{errors.color}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORY_ICON_OPTIONS.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={`Selecionar ícone ${option.label}`}
                      className={[
                        'flex h-9 w-full items-center justify-center rounded-xl border bg-secondary/85 text-muted-foreground transition-all duration-200',
                        values.icon === option.value ? 'border-primary-neon text-primary-neon' : 'border-border'
                      ].join(' ')}
                      onClick={() => {
                        setValues((current) => ({ ...current, icon: option.value }));
                        setErrors((current) => ({ ...current, icon: undefined }));
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
              {errors.icon ? <p className="text-xs text-danger/95">{errors.icon}</p> : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
