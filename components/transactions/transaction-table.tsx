import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate, parseAmount } from '@/lib/utils/finance';
import type { Category, Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  deletingId?: string | null;
}

export function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
  deletingId
}: TransactionTableProps) {
  const categoriesMap = new Map(categories.map((category) => [category.id, category]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => {
            const category = categoriesMap.get(transaction.categoryId);
            const isExpense = transaction.type === 'EXPENSE';

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge variant={isExpense ? 'danger' : 'success'}>
                    {isExpense ? 'Saída' : 'Entrada'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category?.color || '#94a3b8' }}
                    />
                    {category?.name || 'Sem categoria'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell className={isExpense ? 'text-right font-semibold text-danger' : 'text-right font-semibold text-success'}>
                  {formatCurrency(parseAmount(transaction.amount))}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(transaction)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="icon"
                      disabled={deletingId === transaction.id}
                      onClick={() => onDelete(transaction)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
