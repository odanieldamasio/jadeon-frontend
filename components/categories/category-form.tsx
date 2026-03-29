'use client';

import { useEffect, useState } from 'react';
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

const schema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatorio'),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}$/, 'Cor invalida (ex: #22C55E)'),
  icon: z.string().trim().min(2, 'Icone obrigatorio')
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
      setValues({
        name: category.name,
        color: category.color,
        icon: category.icon
      });
      return;
    }

    setValues(initialValues);
  }, [open, category]);

  const title = category ? 'Editar Categoria' : 'Nova Categoria';

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
            {errors.name ? <p className="text-xs text-danger">{errors.name}</p> : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                value={values.color}
                onChange={(event) => {
                  setValues((current) => ({ ...current, color: event.target.value }));
                  setErrors((current) => ({ ...current, color: undefined }));
                }}
              />
              {errors.color ? <p className="text-xs text-danger">{errors.color}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icone</Label>
              <Input
                id="icon"
                value={values.icon}
                onChange={(event) => {
                  setValues((current) => ({ ...current, icon: event.target.value }));
                  setErrors((current) => ({ ...current, icon: undefined }));
                }}
              />
              {errors.icon ? <p className="text-xs text-danger">{errors.icon}</p> : null}
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
