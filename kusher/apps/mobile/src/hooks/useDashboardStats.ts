import { useState, useEffect } from 'react';
import { getProgressStats } from '../services/api/progress';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    streak: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    lifeRegained: 0,
    loading: true,
    error: null as string | null,
  });

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true }));
      const data = await getProgressStats();
      
      setStats({
        streak: data.streak_days || 0,
        cigarettesAvoided: data.cigarettes_avoided || 0,
        moneySaved: data.money_saved || 0,
        lifeRegained: data.life_regained_hours || 0,
        loading: false,
        error: null,
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
  }, []);

  return { ...stats, refresh: fetchStats };
}
