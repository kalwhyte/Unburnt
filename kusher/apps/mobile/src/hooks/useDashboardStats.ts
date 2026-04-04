import { useState, useEffect } from 'react';
import { getDashboard } from '../services/api/progress';
import { useRefreshStore } from '@/store/useRefreshStore';

export function useDashboardStats() {
  const dashboardKey = useRefreshStore((state) => state.dashboardKey);
  const [stats, setStats] = useState({
    streak: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    lifeRegained: 0,
    nextMilestone: null as { name: string; requiredHours: number; progressPercent: number } | null,
    loading: true,
    error: null as string | null,
  });

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true }));
      const res = await getDashboard();
      const d = res.data;
      setStats({
        streak:            Math.floor((d.currentStreakHours ?? 0) / 24),
        cigarettesAvoided: d.cigarettesAvoidedToday ?? 0,
        moneySaved:        d.moneySavedTotal ?? 0,
        lifeRegained:      d.longestStreakHours ?? 0,
        nextMilestone:     d.nextMilestone ?? null,
        loading:           false,
        error:             null,
      });
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard stats',
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dashboardKey]);

  return { ...stats, refresh: fetchStats };
}
