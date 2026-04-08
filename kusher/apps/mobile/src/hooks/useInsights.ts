import React, { useState, useEffect, useCallback } from 'react';
import { getInsightsSummary } from '../services/api/insights';
import { useFocusEffect } from 'expo-router/build/exports';

export function useInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData]));

  return { data, loading, error, refresh: fetchData };
}