// import { useState, useEffect } from 'react';
// import {
//   getDashboard,
//   getStreaks,
//   getSavingsData,
//   getHealthTimeline,
//   getWeeklySummary,
//   processMilestones,
//   processHealthTimeline
// } from '../services/api/progress';
// import { getDailyCravings, getInsightsSummary } from '@/services/api/insights';

// export function useProgress() {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<any>(null);
//   const [milestones, setMilestones] = useState<any[]>([]);
//   const [health, setHealth] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const results = await Promise.allSettled([
//         getDashboard(),
//         getStreaks(),
//         getSavingsData(),
//         getHealthTimeline(),
//         getWeeklySummary(),
//       ]);

//       const [
//         statsRes,
//         streaksRes,
//         savingsRes,
//         healthRes,
//         weeklySummaryRes] = results;

//       if (statsRes.status === 'fulfilled') setStats(statsRes.value);
//       if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
//       if (streaksRes.status === 'fulfilled') setStats(streaksRes.value);
//       if (savingsRes.status === 'fulfilled') setStats(savingsRes.value);
//       if (weeklySummaryRes.status === 'fulfilled') setStats(weeklySummaryRes.value);

//       const processedMilestones = processMilestones(statsRes.status === 'fulfilled' ? statsRes.value : { milestones: [] });
//       const healthData = processHealthTimeline(healthRes.status === 'fulfilled' ? healthRes.value : { timeline: [] });
//       setMilestones(processedMilestones);
//       setHealth(healthData);


//       setError(null);
//     } catch (err) {
//       setError('Failed to load progress data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return {
//     stats,
//     milestones,
//     health,
//     loading,
//     error,
//     refresh: fetchData,
//   };
// }

import { useState, useEffect } from 'react';
import { getDashboard, getSavingsData, getHealthTimeline } from '../services/api/progress';
import { getDailyCravings, getInsightsSummary } from '../services/api/insights';

const PERIOD_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '3m': 90,
};

export function useProgress(period: '7d' | '30d' | '3m') {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const days = PERIOD_DAYS[period];
      const from = new Date(Date.now() - days * 864000000).toISOString();
      const to = new Date().toISOString();

      const [dashboard, savings, timeline, dailyCravings, insights] = await Promise.all([
        getDashboard(),
        getSavingsData(),
        getHealthTimeline(),
        getDailyCravings(),
        getInsightsSummary(),
      ]);

      const streakHours = dashboard?.data?.currentStreakHours ?? 0;
      const streakDays  = Math.floor(streakHours / 24);
      const cvs         = insights?.cravingVsSmoking;
      const moneySaved  = savings?.saved?.total ?? 0;
      const dailyRate   = savings?.saved?.today ?? 0;

      const dailyCravingCounts = (dailyCravings ?? [])
        .slice(-14)
        .map((d: any) => d.count);

      const milestones = (timeline?.milestones ?? []).map((m: any) => ({
        id:         m.name,
        title:      m.name,
        subtitle:   `${m.requiredHours < 24
          ? `${m.requiredHours}h`
          : `${Math.round(m.requiredHours / 24)}d`} smoke-free`,
        achieved:   m.achieved,
        achievedAt: (() => {
          if (!m.achievedAt) return null;
          const date = new Date(m.achievedAt);
          if (isNaN(date.getTime())) return null;
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        })(),
        // progressPercent: m.progressPercent,
        // achievedAt: m.achievedAt
        //   ? new Date(m.achievedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        //   : null,
        progress: m.achieved ? undefined : m.progressPercent,
      }));

      setStats({
        smokeFreeRate:    streakDays > 0 ? 100 : 0,
        dailySmokeFree:   Array(14).fill(0).map((_, i) => i < streakDays ? 1 : 0),
        cravingsResisted: cvs?.resisted ?? 0,
        cravingsTotal:    cvs?.totalCravings ?? 0,
        dailyCravings:    dailyCravingCounts.length > 0 ? dailyCravingCounts : Array(14).fill(0),
        moneySaved,
        projectedMonthly: +(dailyRate * 30).toFixed(2),
        milestones,
      });

      setError(null);
    } catch (err) {
      setError('Failed to load progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [period]);

  return { stats, loading, error, refresh: fetchData };
}