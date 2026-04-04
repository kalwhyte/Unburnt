import { useState } from 'react';
import { api } from '../services/api/client';
import { useRefreshStore } from '@/store/useRefreshStore';


export function useCraving() {
  const [loading, setLoading] = useState(false);
  const triggerDashboardRefresh = useRefreshStore((state) => state.triggerDashboardRefresh);

  const logCraving = async (payload: {
    intensity: number;
    trigger?: string;
    mood?: string;
    notes?: string;
    resisted: boolean;
  }) => {
    setLoading(true);
    try {
      await api.post('/cravings', {
        intensity: payload.intensity,
        outcome:   payload.resisted ? 'RESISTED' : 'SMOKED', // ← boolean → enum
        mood:      payload.mood,
        note:      payload.notes,
        loggedAt:  new Date().toISOString(),
        // triggerId omitted — it must be a UUID, label strings will cause 400
      });
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to log craving:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { logCraving, loading };
}