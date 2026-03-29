'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BillingUrlResponse, PlanType, User } from '@/types';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get<User>('/users/me');
      return response.data;
    }
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (planType: Exclude<PlanType, 'FREE'>) => {
      const response = await api.post<BillingUrlResponse>('/billing/checkout', {
        planType
      });
      return response.data;
    }
  });
}

export function useCreatePortal() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<BillingUrlResponse>('/billing/portal');
      return response.data;
    }
  });
}
