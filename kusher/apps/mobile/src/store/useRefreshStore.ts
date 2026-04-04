import { create } from 'zustand';

interface RefreshStore {
  dashboardKey: number;
  triggerDashboardRefresh: () => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  dashboardKey: 0,
  triggerDashboardRefresh: () => set((s) => ({ dashboardKey: s.dashboardKey + 1 })),
}));