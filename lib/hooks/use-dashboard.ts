'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getMonthRange } from '@/lib/utils/date';
import { parseAmount } from '@/lib/utils/finance';
import type { DashboardSummary, PaginatedResponse, Transaction } from '@/types';

async function fetchAllTransactions(params: { startDate?: string; endDate?: string }) {
  const firstPage = await api.get<PaginatedResponse<Transaction>>('/transactions', {
    params: {
      ...params,
      page: 1,
      limit: 100
    }
  });

  let items = [...firstPage.data.items];

  for (let page = 2; page <= firstPage.data.totalPages; page += 1) {
    const nextPage = await api.get<PaginatedResponse<Transaction>>('/transactions', {
      params: {
        ...params,
        page,
        limit: 100
      }
    });

    items = items.concat(nextPage.data.items);
  }

  return items;
}

function buildMonthlySeries(transactions: Transaction[]) {
  const grouped = new Map<string, { income: number; expense: number }>();

  transactions.forEach((transaction) => {
    const key = new Date(transaction.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
    const amount = parseAmount(transaction.amount);

    const current = grouped.get(key) || { income: 0, expense: 0 };

    if (transaction.type === 'INCOME') {
      current.income += amount;
    } else {
      current.expense += amount;
    }

    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([day, values]) => ({ day, ...values }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      const allTransactions = await fetchAllTransactions({});
      const { startDate, endDate } = getMonthRange();
      const monthTransactions = await fetchAllTransactions({ startDate, endDate });

      const currentBalance = allTransactions.reduce((accumulator, transaction) => {
        const amount = parseAmount(transaction.amount);
        return transaction.type === 'INCOME'
          ? accumulator + amount
          : accumulator - amount;
      }, 0);

      const monthIncome = monthTransactions
        .filter((transaction) => transaction.type === 'INCOME')
        .reduce((accumulator, transaction) => accumulator + parseAmount(transaction.amount), 0);

      const monthExpense = monthTransactions
        .filter((transaction) => transaction.type === 'EXPENSE')
        .reduce((accumulator, transaction) => accumulator + parseAmount(transaction.amount), 0);

      return {
        currentBalance,
        monthIncome,
        monthExpense,
        monthlySeries: buildMonthlySeries(monthTransactions)
      };
    }
  });
}
