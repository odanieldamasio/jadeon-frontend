import axios from 'axios';
import Cookies from 'js-cookie';
import type { AuthResponse } from '@/types';

const REFRESH_TOKEN_KEY = 'jadeon_refresh_token';
const USER_ID_KEY = 'jadeon_user_id';
const COOKIE_DAYS = 14;

function getCookieOptions() {
  return {
    expires: COOKIE_DAYS,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  };
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';
}

export function persistRefreshSession(refreshToken: string, userId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, getCookieOptions());
  Cookies.set(USER_ID_KEY, userId, getCookieOptions());
}

export function getRefreshSession(): { refreshToken: string; userId: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
  const userId = Cookies.get(USER_ID_KEY);

  if (!refreshToken || !userId) {
    return null;
  }

  return { refreshToken, userId };
}

export function clearRefreshSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_ID_KEY);
}

export async function requestRefreshSession(): Promise<AuthResponse> {
  const session = getRefreshSession();

  if (!session) {
    throw new Error('Missing refresh session');
  }

  const response = await axios.post<AuthResponse>(`${getApiBaseUrl()}/auth/refresh`, {
    userId: session.userId,
    refreshToken: session.refreshToken
  });

  return response.data;
}
