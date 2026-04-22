import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import memoryStore from './memoryStore'
import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

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
  reset: () => void
}

const INITIAL_STATE = {
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
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setHabits: () => {},
      setField: (key, value) => set({ [key]: value }),
      markComplete: async () => {
        set({ completed: true });
        return;
      },
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => zustandStorage),
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
