import { useState, useEffect } from 'react';
import { getProgressStats, getMilestones, getHealthImprovements } from '../services/api/progress';

export function useProgress() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, milestonesData, healthData] = await Promise.all([
        getProgressStats(),
        getMilestones(),
        getHealthImprovements(),
      ]);

      setStats(statsData);
      setMilestones(milestonesData);
      setHealth(healthData);
      setError(null);
    } catch (err) {
      setError('Failed to load progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    milestones,
    health,
    loading,
    error,
    refresh: fetchData,
  };
}
