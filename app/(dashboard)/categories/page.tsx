'use client';

import {
  BriefcaseBusiness,
  Car,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Pencil,
  Plane,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Wallet
} from 'lucide-react';
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
      setFormError(getErrorMessage(error, 'Não foi possível salvar a categoria.'));
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
      window.alert('Não foi possível remover esta categoria.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize seu plano de contas com regras claras.</p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova categoria
        </Button>
      </header>

      {formError ? <p className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p> : null}

      <Card className="overflow-hidden">
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
            <p className="text-sm text-danger">Não foi possível carregar as categorias.</p>
          ) : categoriesQuery.data?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categoriesQuery.data.map((category) => (
                <article key={category.id} className="hover-lift rounded-2xl border border-border bg-card/85 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h2 className="font-semibold text-foreground">{category.name}</h2>
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary/80">
                      {(() => {
                        const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Tag;
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </span>
                    <span>{category.icon}</span>
                  </div>
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
  const iconMap = {
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
