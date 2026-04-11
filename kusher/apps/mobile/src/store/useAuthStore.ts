import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import memoryStore from "./memoryStore";

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  setHashHydrated: (val: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHashHydrated: (val) => set({ _hasHydrated: val }),
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHashHydrated(true);
      },
    }
    // { name: 'auth', storage: createJSONStorage(() => memoryStore) }
  )
);