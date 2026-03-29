'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CategoryForm } from '@/components/categories/category-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory
} from '@/lib/hooks/use-categories';
import { getErrorMessage } from '@/lib/utils/error';
import type { Category, CreateCategoryPayload } from '@/types';

export default function CategoriesPage() {
  const categoriesQuery = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateCategoryPayload) => {
    setFormError(null);

    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.id,
          data: payload
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Nao foi possivel salvar a categoria.'));
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`Excluir categoria "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(category.id);
    } catch {
      window.alert('Nao foi possivel remover esta categoria.');
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize seu plano de contas com regras claras.</p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova categoria
        </Button>
      </header>

      {formError ? <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Lista de categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesQuery.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          ) : categoriesQuery.isError ? (
            <p className="text-sm text-danger">Nao foi possivel carregar as categorias.</p>
          ) : categoriesQuery.data?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categoriesQuery.data.map((category) => (
                <article key={category.id} className="rounded-lg border border-border/80 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h2 className="font-semibold">{category.name}</h2>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">Icone: {category.icon}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      <Pencil className="mr-1 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleteMutation.isPending && deleteMutation.variables === category.id}
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>
          )}
        </CardContent>
      </Card>

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
