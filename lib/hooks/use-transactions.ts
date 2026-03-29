'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  CreateTransactionPayload,
  PaginatedResponse,
  Transaction,
  TransactionsFilters,
  UpdateTransactionPayload
} from '@/types';

function buildParams(filters: TransactionsFilters) {
  return {
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    page: filters.page || 1,
    limit: filters.limit || 10
  };
}

export function useTransactions(filters: TransactionsFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Transaction>>('/transactions', {
        params: buildParams(filters)
      });
      return response.data;
    },
    placeholderData: keepPreviousData
  });
}

export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: ['transactions', 'recent', limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Transaction>>('/transactions', {
        params: {
          page: 1,
          limit
        }
      });

      return response.data.items;
    }
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const response = await api.post<Transaction>('/transactions', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    }
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: UpdateTransactionPayload }) => {
      const response = await api.patch<Transaction>(`/transactions/${payload.id}`, payload.data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    }
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<Transaction>(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    }
  });
}
