// ─────────────────────────────────────────────
// src/store/dashboardStore.ts

import { create } from "zustand"

// ─────────────────────────────────────────────
interface DashboardState {
  streakDays: number
  cigarettesAvoided: number
  moneySaved: number        // in ₦
  lifeRegainedHours: number
  lastSyncedAt: string | null
  setStats: (s: Partial<DashboardState>) => void
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  streakDays: 0,
  cigarettesAvoided: 0,
  moneySaved: 0,
  lifeRegainedHours: 0,
  lastSyncedAt: null,
  setStats: (s) => set(s),
}))