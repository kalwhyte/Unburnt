// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
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
//     { 
//       name: 'onboarding-storage', 
//       storage: createJSONStorage(() => AsyncStorage) 
//     }
//   )
// )

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface OnboardingState {
  cigarettesPerDay: string
  yearsSmoked: string
  smokingTimes: string[]
  cigaretteType: string
  triggers: string[]
  reasons: string[]
  strategy: string
  quitDateChoice: string
  packPrice: string
  completed: boolean
  setField: (key: keyof Omit<OnboardingState, 'setField' | 'markComplete'>, value: any) => void
  markComplete: () => Promise<void>
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      cigarettesPerDay: '',
      yearsSmoked: '',
      smokingTimes: [],
      cigaretteType: '',
      triggers: [],
      reasons: [],
      strategy: 'gradual',
      quitDateChoice: 'week',
      packPrice: '$12',
      completed: false,
      setField: (key, value) => {
        set({ [key]: value });
      },
      markComplete: async () => {
        set({ completed: true });
      },
    }),
    { name: 'onboarding', storage: createJSONStorage(() => AsyncStorage) }
  )
)