import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  setUser: (user: { id: string; name: string; email: string }) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // Name for the localStorage key
    }
  )
);