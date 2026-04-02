'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Select } from '@/components/ui/select';
import {
  fromBrDateInputValue,
  isValidBrDateInput,
  normalizeBrDateInput,
  toBrDateInputValue
} from '@/lib/utils/date';
import { maskCurrencyInput, parseAmount } from '@/lib/utils/finance';
import type { Category, CreateTransactionPayload, Transaction } from '@/types';

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.string().refine((value) => parseAmount(value) > 0, 'Valor deve ser maior que zero'),
  description: z.string().trim().min(2, 'Descrição obrigatória'),
  date: z.string().refine((value) => isValidBrDateInput(value), 'Data inválida (dd/mm/aaaa)'),
  categoryId: z.string().min(1, 'Categoria obrigatória')
});

type FormValues = {
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  description: string;
  date: string;
  categoryId: string;
};

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  isPending?: boolean;
  transaction?: Transaction | null;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void> | void;
}

const initialValues: FormValues = {
  type: 'EXPENSE',
  amount: '',
  description: '',
  date: toBrDateInputValue(new Date().toISOString()),
  categoryId: ''
};

export function TransactionForm({
  open,
  onOpenChange,
  categories,
  isPending,
  transaction,
  onSubmit
}: TransactionFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const firstCategoryId = categories[0]?.id;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (transaction) {
      setValues({
        type: transaction.type,
        amount: maskCurrencyInput(String(transaction.amount)),
        description: transaction.description,
        date: toBrDateInputValue(transaction.date),
        categoryId: transaction.categoryId
      });
      return;
    }

    setValues((current) => ({
      ...initialValues,
      categoryId: firstCategoryId || current.categoryId
    }));
  }, [open, transaction, firstCategoryId]);

  const title = useMemo(() => (transaction ? 'Editar transação' : 'Nova transação'), [transaction]);

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        type: fieldErrors.type?.[0],
        amount: fieldErrors.amount?.[0],
        description: fieldErrors.description?.[0],
        date: fieldErrors.date?.[0],
        categoryId: fieldErrors.categoryId?.[0]
      });
      return;
    }

    await onSubmit({
      type: parsed.data.type,
      amount: parseAmount(parsed.data.amount),
      description: parsed.data.description,
      date: fromBrDateInputValue(parsed.data.date),
      categoryId: parsed.data.categoryId,
      source: 'MANUAL'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar sua movimentação financeira.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={values.type === 'INCOME' ? 'secondary' : 'outline'}
                className={
                  values.type === 'INCOME'
                    ? 'border-success bg-success/30 text-success shadow-[0_0_0_1px_rgba(34,197,94,0.45),0_16px_34px_-22px_rgba(34,197,94,0.75)]'
                    : 'border-success/35 text-success hover:border-success/55'
                }
                onClick={() => updateField('type', 'INCOME')}
              >
                Entrada
              </Button>
              <Button
                type="button"
                variant={values.type === 'EXPENSE' ? 'secondary' : 'outline'}
                className={
                  values.type === 'EXPENSE'
                    ? 'border-danger bg-danger/28 text-danger shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_16px_34px_-22px_rgba(239,68,68,0.7)]'
                    : 'border-danger/35 text-danger hover:border-danger/55'
                }
                onClick={() => updateField('type', 'EXPENSE')}
              >
                Saída
              </Button>
            </div>
            {errors.type ? <p className="text-xs text-danger/95">{errors.type}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={values.amount}
              onChange={(event) => updateField('amount', maskCurrencyInput(event.target.value))}
            />
            {errors.amount ? <p className="text-xs text-danger/95">{errors.amount}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={values.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
            {errors.description ? <p className="text-xs text-danger/95">{errors.description}</p> : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                value={values.date}
                onChange={(event) => updateField('date', normalizeBrDateInput(event.target.value))}
              />
              {errors.date ? <p className="text-xs text-danger/95">{errors.date}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                id="category"
                value={values.categoryId}
                onChange={(event) => updateField('categoryId', event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId ? <p className="text-xs text-danger/95">{errors.categoryId}</p> : null}
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
