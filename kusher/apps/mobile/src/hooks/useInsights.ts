import { useState, useEffect } from 'react';
import { getInsightsSummary } from '../services/api/insights';

export function useInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getInsightsSummary();
      setData(res);
      setError(null);
    } catch (err) {
      setError('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, loading, error, refresh: fetchData };
}