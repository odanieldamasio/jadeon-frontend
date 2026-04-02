'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, PlanType } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  phone?: string;
  planType?: PlanType;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await api.post<AuthResponse>('/auth/login', payload);
      return response.data;
    },
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await api.post<AuthResponse>('/auth/register', payload);
      return response.data;
    },
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
    }
  });
}

export function useLogout() {
  return () => {
    useAuthStore.getState().clearSession();
  };
}
