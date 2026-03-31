// // src/store/onboardingStore.ts
// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
// // @ts-ignore
// import AsyncStorage from '@react-native-async-storage/async-storage'

// interface SmokingProfile {
//   cigsPerDay: number
//   years: number
//   costPerPack: number
//   triggers: string[]
// }

// interface OnboardingState {
//   profile: SmokingProfile | null
//   quitReason: string | null
//   quitPlan: 'cold-turkey' | 'gradual' | 'nrt' | null
//   quitDate: string | null          // ISO date string
//   notificationsEnabled: boolean
//   completed: boolean

//   setProfile: (p: SmokingProfile) => void
//   setQuitReason: (r: string) => void
//   setQuitPlan: (p: OnboardingState['quitPlan']) => void
//   setQuitDate: (d: string) => void
//   setNotificationsEnabled: (v: boolean) => void
//   complete: () => void
//   reset: () => void
// }

// export const useOnboardingStore = create<OnboardingState>()(
//   persist(
//     (set) => ({
//       profile: null,
//       quitReason: null,
//       quitPlan: null,
//       quitDate: null,
//       notificationsEnabled: false,
//       completed: false,

//       setProfile: (profile) => set({ profile }),
//       setQuitReason: (quitReason) => set({ quitReason }),
//       setQuitPlan: (quitPlan) => set({ quitPlan }),
//       setQuitDate: (quitDate) => set({ quitDate }),
//       setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
//       complete: () => set({ completed: true }),
//       reset: () => set({ profile: null, quitReason: null, quitPlan: null, quitDate: null, completed: false }),
//     }),
//     { name: 'onboarding', storage: createJSONStorage(() => AsyncStorage) }
//   )
// )

// ─────────────────────────────────────────────
// src/store/authStore.ts
// ─────────────────────────────────────────────
// interface User {
//   id: string
//   email: string
//   name: string
//   avatarUrl?: string
// }

// interface AuthState {
//   user: User | null
//   token: string | null
//   isAuthenticated: boolean
//   setAuth: (user: User, token: string) => void
//   clearAuth: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
//       clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
//     }),
//     { name: 'auth', storage: createJSONStorage(() => AsyncStorage) }
//   )
// )


