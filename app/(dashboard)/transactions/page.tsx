'use client';

import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionTable } from '@/components/transactions/transaction-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/lib/hooks/use-categories';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction
} from '@/lib/hooks/use-transactions';
import {
  fromBrDateInputValue,
  isValidBrDateInput,
  normalizeBrDateInput
} from '@/lib/utils/date';
import { getErrorMessage } from '@/lib/utils/error';
import type { CreateTransactionPayload, Transaction } from '@/types';

interface FiltersState {
  type: '' | 'INCOME' | 'EXPENSE';
  categoryId: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
}

const initialFilters: FiltersState = {
  type: '',
  categoryId: '',
  startDate: '',
  endDate: '',
  page: 1,
  limit: 10
};

const CREATE_MODAL_QUERY_KEY = 'modal';
const CREATE_MODAL_QUERY_VALUE = 'nova';

export default function TransactionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions({
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    startDate: isValidBrDateInput(filters.startDate) ? fromBrDateInputValue(filters.startDate) : undefined,
    endDate: isValidBrDateInput(filters.endDate) ? fromBrDateInputValue(filters.endDate, true) : undefined,
    page: filters.page,
    limit: filters.limit
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const totalPages = transactionsQuery.data?.totalPages || 1;

  const categories = useMemo(() => categoriesQuery.data || [], [categoriesQuery.data]);
  const canCreate = categories.length > 0;
  const showNoCategoriesWarning = categoriesQuery.isSuccess && !canCreate;

  const replaceSearchParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const openCreateModalInRoute = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(CREATE_MODAL_QUERY_KEY) === CREATE_MODAL_QUERY_VALUE) {
      return;
    }

    params.set(CREATE_MODAL_QUERY_KEY, CREATE_MODAL_QUERY_VALUE);
    replaceSearchParams(params);
  }, [replaceSearchParams, searchParams]);

  const clearCreateModalInRoute = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(CREATE_MODAL_QUERY_KEY) !== CREATE_MODAL_QUERY_VALUE) {
      return;
    }

    params.delete(CREATE_MODAL_QUERY_KEY);
    replaceSearchParams(params);
  }, [replaceSearchParams, searchParams]);

  useEffect(() => {
    if (!canCreate) {
      return;
    }

    if (searchParams.get(CREATE_MODAL_QUERY_KEY) === CREATE_MODAL_QUERY_VALUE) {
      setEditingTransaction(null);
      setFormError(null);
      setIsFormOpen(true);
    }
  }, [canCreate, searchParams]);

  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === 'page' ? (value as number) : 1
    }));
  };

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setFormError(null);
    setIsFormOpen(true);
    openCreateModalInRoute();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormError(null);
    setIsFormOpen(true);
    clearCreateModalInRoute();
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);

    if (!open) {
      setEditingTransaction(null);
      clearCreateModalInRoute();
    }
  };

  const handleSubmit = async (payload: CreateTransactionPayload) => {
    setFormError(null);

    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({
          id: editingTransaction.id,
          data: payload
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
      clearCreateModalInRoute();
    } catch (error) {
      setFormError(getErrorMessage(error, 'Não foi possível salvar a transação.'));
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    const confirmed = window.confirm(`Excluir transação "${transaction.description}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(transaction.id);
    } catch {
      window.alert('Não foi possível excluir esta transação.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Transações</h1>
          <p className="text-sm text-muted-foreground">Gerencie entradas e saídas com filtros e edição rápida.</p>
        </div>

        <Button onClick={handleOpenCreate} disabled={!canCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova transação
        </Button>
      </header>

      {showNoCategoriesWarning ? (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Crie ao menos uma categoria antes de registrar transações.
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <Button
              type="button"
              variant={filters.type === 'INCOME' ? 'secondary' : 'outline'}
              className={
                filters.type === 'INCOME'
                  ? 'border-success/55 bg-success/18 text-success hover:border-success/70'
                  : 'border-success/35 text-success hover:border-success/55'
              }
              onClick={() => updateFilter('type', filters.type === 'INCOME' ? '' : 'INCOME')}
            >
              Entrada
            </Button>
            <Button
              type="button"
              variant={filters.type === 'EXPENSE' ? 'secondary' : 'outline'}
              className={
                filters.type === 'EXPENSE'
                  ? 'border-danger/55 bg-danger/18 text-danger hover:border-danger/70'
                  : 'border-danger/35 text-danger hover:border-danger/55'
              }
              onClick={() => updateFilter('type', filters.type === 'EXPENSE' ? '' : 'EXPENSE')}
            >
              Saída
            </Button>
          </div>

          <Select
            value={filters.categoryId}
            onChange={(event) => updateFilter('categoryId', event.target.value)}
            placeholder="Categoria"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Input
            inputMode="numeric"
            placeholder="Data inicial (dd/mm/aaaa)"
            value={filters.startDate}
            onChange={(event) => updateFilter('startDate', normalizeBrDateInput(event.target.value))}
          />

          <Input
            inputMode="numeric"
            placeholder="Data final (dd/mm/aaaa)"
            value={filters.endDate}
            onChange={(event) => updateFilter('endDate', normalizeBrDateInput(event.target.value))}
          />

          <Button variant="outline" onClick={() => setFilters(initialFilters)}>
            Limpar
          </Button>
        </CardContent>
      </Card>

      {formError ? <p className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p> : null}

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Lista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionsQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : transactionsQuery.isError ? (
            <p className="text-sm text-danger">Não foi possível carregar as transações.</p>
          ) : (
            <>
              <TransactionTable
                transactions={transactionsQuery.data?.items || []}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
              />

              <div className="flex items-center justify-between border-t border-border/80 pt-4">
                <p className="text-sm text-muted-foreground">
                  Página {transactionsQuery.data?.page || 1} de {totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page <= 1}
                    onClick={() => updateFilter('page', Math.max(filters.page - 1, 1))}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page >= totalPages}
                    onClick={() => updateFilter('page', Math.min(filters.page + 1, totalPages))}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {canCreate ? (
        <TransactionForm
          open={isFormOpen}
          onOpenChange={handleFormOpenChange}
          transaction={editingTransaction}
          categories={categories}
          isPending={isSubmitting}
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  );
}
