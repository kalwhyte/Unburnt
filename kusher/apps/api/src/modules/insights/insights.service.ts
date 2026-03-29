import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Trigger insights + success rate per trigger ─────────────────────────

  async getTriggerInsights(userId: string) {
    const [smokingLogs, cravingLogs] = await Promise.all([
      this.prisma.smokingLog.findMany({
        where:   { userId, triggerId: { not: null } },
        include: { trigger: { select: { id: true, name: true } } },
      }),
      this.prisma.cravingLog.findMany({
        where: { userId, triggerId: { not: null } },
        include: { trigger: { select: { id: true, name: true } } },
      }),
    ]);

    const counts = new Map<string, {
      id: string; name: string;
      smoking: number; craving: number; total: number;
      resisted: number; smokedOnCraving: number;
    }>();

    for (const log of smokingLogs) {
      if (!log.trigger) continue;
      const e = counts.get(log.trigger.id) ?? { id: log.trigger.id, name: log.trigger.name, smoking: 0, craving: 0, total: 0, resisted: 0, smokedOnCraving: 0 };
      e.smoking++; e.total++;
      counts.set(log.trigger.id, e);
    }

    for (const log of cravingLogs) {
      if (!log.trigger) continue;
      const e = counts.get(log.trigger.id) ?? { id: log.trigger.id, name: log.trigger.name, smoking: 0, craving: 0, total: 0, resisted: 0, smokedOnCraving: 0 };
      e.craving++; e.total++;
      if ((log as any).outcome === 'RESISTED') e.resisted++;
      if ((log as any).outcome === 'SMOKED')   e.smokedOnCraving++;
      counts.set(log.trigger.id, e);
    }

    const triggers = Array.from(counts.values())
      .map((t) => ({
        ...t,
        successRate: t.craving > 0 ? Math.round((t.resisted / t.craving) * 100) : null,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      total:      triggers.length,
      topTrigger: triggers[0] ?? null,
      hardest:    triggers.filter(t => t.successRate !== null).sort((a, b) => (a.successRate ?? 0) - (b.successRate ?? 0))[0] ?? null,
      triggers,
    };
  }

  // ─── Mood insights ────────────────────────────────────────────────────────

  async getMoodInsights(userId: string) {
    const [smokingLogs, cravingLogs] = await Promise.all([
      this.prisma.smokingLog.findMany({
        where:  { userId, mood: { not: null } },
        select: { mood: true },
      }),
      this.prisma.cravingLog.findMany({
        where:  { userId, mood: { not: null } },
        select: { mood: true, outcome: true },
      }),
    ]);

    // Mood frequency when smoking
    const smokingMoods = new Map<string, number>();
    for (const log of smokingLogs) {
      if (!log.mood) continue;
      smokingMoods.set(log.mood, (smokingMoods.get(log.mood) ?? 0) + 1);
    }

    // Mood frequency when craving
    const cravingMoods = new Map<string, number>();
    for (const log of cravingLogs) {
      if (!log.mood) continue;
      cravingMoods.set(log.mood, (cravingMoods.get(log.mood) ?? 0) + 1);
    }

    // Mood that most often leads to resistance
    const resistedMoods = new Map<string, number>();
    for (const log of cravingLogs) {
      if (!log.mood || log.outcome !== 'RESISTED') continue;
      resistedMoods.set(log.mood, (resistedMoods.get(log.mood) ?? 0) + 1);
    }

    return {
      whenSmoking:  this.sortedMapEntries(smokingMoods),
      whenCraving:  this.sortedMapEntries(cravingMoods),
      whenResisted: this.sortedMapEntries(resistedMoods),
      topSmokingMood:  this.topEntry(smokingMoods),
      topCravingMood:  this.topEntry(cravingMoods),
      topResistedMood: this.topEntry(resistedMoods),
    };
  }

  // ─── Peak hours (bucketed) ────────────────────────────────────────────────

  async getPeakHours(userId: string) {
    const [smokingLogs, cravingLogs] = await Promise.all([
      this.prisma.smokingLog.findMany({
        where:  { userId },
        select: { loggedAt: true, quantity: true },
      }),
      this.prisma.cravingLog.findMany({
        where:  { userId },
        select: { loggedAt: true },
      }),
    ]);

    // Time buckets
    const BUCKETS: Record<string, { label: string; range: string; hours: number[] }> = {
      earlyMorning: { label: 'Early Morning', range: '00:00–05:59', hours: [0,1,2,3,4,5]        },
      morning:      { label: 'Morning',       range: '06:00–11:59', hours: [6,7,8,9,10,11]      },
      afternoon:    { label: 'Afternoon',     range: '12:00–16:59', hours: [12,13,14,15,16]     },
      evening:      { label: 'Evening',       range: '17:00–20:59', hours: [17,18,19,20]        },
      lateNight:    { label: 'Late Night',    range: '21:00–23:59', hours: [21,22,23]           },
    };

    const smokingByHour = new Array(24).fill(0);
    const cravingByHour = new Array(24).fill(0);

    for (const log of smokingLogs) smokingByHour[log.loggedAt.getHours()] += log.quantity;
    for (const log of cravingLogs) cravingByHour[log.loggedAt.getHours()]++;

    // Aggregate into buckets
    const buckets = Object.entries(BUCKETS).map(([key, bucket]) => {
      const smoking = bucket.hours.reduce((s, h) => s + smokingByHour[h], 0);
      const craving = bucket.hours.reduce((s, h) => s + cravingByHour[h], 0);
      return { key, label: bucket.label, range: bucket.range, smoking, craving, total: smoking + craving };
    });

    const hardestBucket = buckets.reduce((a, b) => b.total > a.total ? b : a);

    return {
      hardestTimeOfDay: hardestBucket.total > 0 ? hardestBucket : null,
      buckets,
      byHour: Array.from({ length: 24 }, (_, h) => ({
        hour:    h,
        label:   `${String(h).padStart(2, '0')}:00`,
        smoking: smokingByHour[h],
        craving: cravingByHour[h],
        total:   smokingByHour[h] + cravingByHour[h],
      })).filter((h) => h.total > 0),
    };
  }

  // ─── Craving vs smoking (willpower ratio) ─────────────────────────────────

  async getCravingVsSmoking(userId: string) {
    const [cravingLogs, smokingLogs] = await Promise.all([
      this.prisma.cravingLog.findMany({
        where:  { userId },
        select: { outcome: true },
      }),
      this.prisma.smokingLog.findMany({
        where:  { userId },
        select: { quantity: true },
      }),
    ]);

    const totalCravings  = cravingLogs.length;
    const resisted       = cravingLogs.filter((c) => c.outcome === 'RESISTED').length;
    const smokedOnCraving = cravingLogs.filter((c) => c.outcome === 'SMOKED').length;
    const unresolved     = cravingLogs.filter((c) => c.outcome === 'UNRESOLVED').length;
    const totalSmoked    = smokingLogs.reduce((s, l) => s + l.quantity, 0);
    const willpowerRate  = totalCravings > 0
      ? Math.round((resisted / totalCravings) * 100)
      : null;

    return {
      totalCravings,
      resisted,
      smokedOnCraving,
      unresolved,
      totalCigarettesSmoked: totalSmoked,
      willpowerRate,
      verdict: this.willpowerVerdict(willpowerRate),
    };
  }

  // ─── Reduction trend vs baseline ─────────────────────────────────────────

  async getReductionTrend(userId: string) {
    const WEEKS   = 6;
    const now     = new Date();
    const profile = await this.prisma.profile.findUnique({
      where:  { userId },
      select: { cigarettesPerDay: true },
    });

    // Baseline = cigarettesPerDay * 7
    const weeklyBaseline = profile ? profile.cigarettesPerDay * 7 : null;
    const weeks: { week: string; total: number; vsBaseline: number | null }[] = [];

    for (let w = WEEKS - 1; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - w * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const logs = await this.prisma.smokingLog.findMany({
        where:  { userId, loggedAt: { gte: weekStart, lte: weekEnd } },
        select: { quantity: true },
      });

      const total = logs.reduce((s, l) => s + l.quantity, 0);
      const vsBaseline = weeklyBaseline && weeklyBaseline > 0
        ? Math.round(((weeklyBaseline - total) / weeklyBaseline) * 100)
        : null;

      weeks.push({
        week:        `${weekStart.toISOString().slice(0, 10)} to ${weekEnd.toISOString().slice(0, 10)}`,
        total,
        vsBaseline,  // positive = below baseline (good), negative = above baseline (bad)
      });
    }

    // Week-over-week change
    const trend = weeks.map((w, i) => {
      if (i === 0) return { ...w, change: null, changePercent: null };
      const prev          = weeks[i - 1].total;
      const change        = w.total - prev;
      const changePercent = prev > 0 ? Math.round((change / prev) * 100) : null;
      return { ...w, change, changePercent };
    });

    const latestWeek   = weeks[weeks.length - 1].total;
    const earliestWeek = weeks[0].total;
    const overallReduction = earliestWeek > 0
      ? Math.round(((earliestWeek - latestWeek) / earliestWeek) * 100)
      : null;

    return {
      weeklyBaseline,
      overallReductionPercent: overallReduction,
      trend,
    };
  }

  // ─── Summary — all insights in one call ───────────────────────────────────

  async getSummary(userId: string) {
    const [triggers, mood, peakHours, cravingVsSmoking, reduction] = await Promise.all([
      this.getTriggerInsights(userId),
      this.getMoodInsights(userId),
      this.getPeakHours(userId),
      this.getCravingVsSmoking(userId),
      this.getReductionTrend(userId),
    ]);

    return { triggers, mood, peakHours, cravingVsSmoking, reduction };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private sortedMapEntries(map: Map<string, number>) {
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([mood, count]) => ({ mood, count }));
  }

  private topEntry(map: Map<string, number>): string | null {
    if (map.size === 0) return null;
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  private willpowerVerdict(rate: number | null): string | null {
    if (rate === null) return null;
    if (rate >= 80) return 'Exceptional — you are in control.';
    if (rate >= 60) return 'Strong — keep building the habit.';
    if (rate >= 40) return 'Developing — every resist counts.';
    return 'Keep going — the streak starts with one.';
  }
}