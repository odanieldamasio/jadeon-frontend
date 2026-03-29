'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { fromDateInputValue } from '@/lib/utils/date';
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

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions({
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    startDate: filters.startDate ? fromDateInputValue(filters.startDate) : undefined,
    endDate: filters.endDate ? fromDateInputValue(filters.endDate, true) : undefined,
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
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormError(null);
    setIsFormOpen(true);
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
    } catch (error) {
      setFormError(getErrorMessage(error, 'Nao foi possivel salvar a transacao.'));
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    const confirmed = window.confirm(`Excluir transacao "${transaction.description}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(transaction.id);
    } catch {
      window.alert('Nao foi possivel excluir esta transacao.');
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transacoes</h1>
          <p className="text-sm text-muted-foreground">Gerencie entradas e saidas com filtros e edicao rapida.</p>
        </div>

        <Button onClick={handleOpenCreate} disabled={!canCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova transacao
        </Button>
      </header>

      {showNoCategoriesWarning ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Crie ao menos uma categoria antes de registrar transacoes.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <Select
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value as FiltersState['type'])}
            placeholder="Tipo"
          >
            <option value="INCOME">Entrada</option>
            <option value="EXPENSE">Saida</option>
          </Select>

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
            type="date"
            value={filters.startDate}
            onChange={(event) => updateFilter('startDate', event.target.value)}
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(event) => updateFilter('endDate', event.target.value)}
          />

          <Button variant="outline" onClick={() => setFilters(initialFilters)}>
            Limpar
          </Button>
        </CardContent>
      </Card>

      {formError ? <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p> : null}

      <Card>
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
            <p className="text-sm text-danger">Nao foi possivel carregar as transacoes.</p>
          ) : (
            <>
              <TransactionTable
                transactions={transactionsQuery.data?.items || []}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Pagina {transactionsQuery.data?.page || 1} de {totalPages}
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
                    Proxima
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
          onOpenChange={setIsFormOpen}
          transaction={editingTransaction}
          categories={categories}
          isPending={isSubmitting}
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  );
}
