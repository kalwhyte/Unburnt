import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';

// type User = {
//   id: string;
//   email: string;
// };

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   setAuth: (user: User, token: string) => void;
//   logout: () => void;
// };

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,

//   setAuth: (user, token) =>
//     set({
//       user,
//       token,
//     }),

//   logout: () =>
//     set({
//       user: null,
//       token: null,
//     }),
// }));

// ─────────────────────────────────────────────
// src/store/authStore.ts
// ─────────────────────────────────────────────
interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth', storage: createJSONStorage(() => AsyncStorage) }
  )
)