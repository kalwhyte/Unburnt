import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WeeklySummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeeklySummary(userId: string) {
    const now       = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const [thisWeekLogs, lastWeekLogs, thisWeekCravings] = await Promise.all([
      this.prisma.smokingLog.findMany({
        where: { userId, loggedAt: { gte: weekStart } },
        select: { quantity: true, loggedAt: true },
      }),
      this.prisma.smokingLog.findMany({
        where: { userId, loggedAt: { gte: prevWeekStart, lt: weekStart } },
        select: { quantity: true },
      }),
      this.prisma.cravingLog.findMany({
        where: { userId, loggedAt: { gte: weekStart } },
        select: { outcome: true, intensity: true },
      }),
    ]);

    const thisWeekTotal = thisWeekLogs.reduce((s, l) => s + l.quantity, 0);
    const lastWeekTotal = lastWeekLogs.reduce((s, l) => s + l.quantity, 0);
    const reduction     = lastWeekTotal > 0
      ? Math.round(((lastWeekTotal - thisWeekTotal) / lastWeekTotal) * 100)
      : null;

    const resisted   = thisWeekCravings.filter((c) => c.outcome === 'RESISTED').length;
    const resistRate = thisWeekCravings.length > 0
      ? Math.round((resisted / thisWeekCravings.length) * 100)
      : null;

    const byDay: Record<string, number> = {};
    for (const log of thisWeekLogs) {
      const day = log.loggedAt.toISOString().slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + log.quantity;
    }

    return {
      period: {
        from: weekStart.toISOString().slice(0, 10),
        to:   now.toISOString().slice(0, 10),
      },
      smoking: {
        thisWeek:         thisWeekTotal,
        lastWeek:         lastWeekTotal,
        reductionPercent: reduction,
      },
      cravings: {
        total:      thisWeekCravings.length,
        resisted,
        resistRate,
      },
      dailyBreakdown: byDay,
    };
  }
}