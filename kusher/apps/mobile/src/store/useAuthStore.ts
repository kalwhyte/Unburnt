import { create } from "zustand";
import { createJSONStorage, persist, StateStorage} from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

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
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (val: boolean) => void
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
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      setHashHydrated: (val) => set({ _hasHydrated: val }),
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHashHydrated(true);
      },
    }
  )
);