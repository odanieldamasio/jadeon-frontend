import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig
} from 'axios';
import { getApiBaseUrl, requestRefreshSession } from '@/lib/auth';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse } from '@/types';

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<AuthResponse> | null = null;

function getRefreshPromise(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = requestRefreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function isAuthRoute(url?: string): boolean {
  if (!url) {
    return false;
  }

  return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
}

export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetryableConfig | undefined;

    if (!originalConfig || error.response?.status !== 401 || originalConfig._retry || isAuthRoute(originalConfig.url)) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    try {
      const refreshedSession = await getRefreshPromise();
      useAuthStore.getState().setSession(refreshedSession);
      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers.Authorization = `Bearer ${refreshedSession.accessToken}`;

      return api(originalConfig);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    }
  }
);
