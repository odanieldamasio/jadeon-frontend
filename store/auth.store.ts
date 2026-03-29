import { create } from 'zustand';
import { clearRefreshSession, persistRefreshSession, requestRefreshSession } from '@/lib/auth';
import type { AuthResponse, User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  isRestoring: boolean;
  setSession: (payload: AuthResponse) => void;
  updateAccessToken: (token: string) => void;
  clearSession: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  hydrated: false,
  isRestoring: false,
  setSession: (payload) => {
    persistRefreshSession(payload.refreshToken, payload.user.id);
    set({
      user: payload.user,
      accessToken: payload.accessToken,
      hydrated: true
    });
  },
  updateAccessToken: (token) => {
    set({ accessToken: token });
  },
  clearSession: () => {
    clearRefreshSession();
    set({ user: null, accessToken: null, hydrated: true, isRestoring: false });
  },
  restoreSession: async () => {
    const state = get();

    if (state.isRestoring || state.hydrated || state.accessToken) {
      if (!state.hydrated) {
        set({ hydrated: true });
      }
      return;
    }

    set({ isRestoring: true });

    try {
      const response = await requestRefreshSession();
      get().setSession(response);
    } catch {
      get().clearSession();
    } finally {
      set({ hydrated: true, isRestoring: false });
    }
  }
}));
