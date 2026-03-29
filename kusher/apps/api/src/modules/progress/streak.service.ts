import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QuitPlanType } from '@prisma/client';

@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async computeStreak(userId: string) {
    const [profile, activePlan, lastLog] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.quitPlan.findFirst({ where: { userId, active: true } }),
      this.prisma.smokingLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
      }),
    ]);

    // Streak start = later of (last smoking log | quit date | plan start)
    let streakStart: Date | null = null;
    if (lastLog)                   streakStart = lastLog.loggedAt;
    else if (activePlan?.quitDate) streakStart = activePlan.quitDate;
    else if (activePlan?.startDate) streakStart = activePlan.startDate;
    else if (profile?.quitDate)    streakStart = profile.quitDate;

    const now                = new Date();
    const currentStreakHours = streakStart
      ? Math.max(0, (now.getTime() - streakStart.getTime()) / 3600000)
      : 0;

    // Longest streak — largest gap between consecutive smoking logs
    const allLogs = await this.prisma.smokingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
      select: { loggedAt: true },
    });

    let longestStreakHours = currentStreakHours;
    for (let i = 1; i < allLogs.length; i++) {
      const gap = (allLogs[i].loggedAt.getTime() - allLogs[i - 1].loggedAt.getTime()) / 3600000;
      if (gap > longestStreakHours) longestStreakHours = gap;
    }

    return {
      currentStreakHours: +currentStreakHours.toFixed(2),
      longestStreakHours: +longestStreakHours.toFixed(2),
      lastSmokingEvent:   lastLog?.loggedAt ?? null,
    };
  }

  async getStreakSummary(userId: string) {
    const activePlan = await this.prisma.quitPlan.findFirst({
      where: { userId, active: true },
      include: { steps: { orderBy: { weekNumber: 'asc' } } },
    });

    const streakData = await this.computeStreak(userId);

    let complianceStreak: number | null = null;
    if (activePlan?.type === QuitPlanType.GRADUAL) {
      complianceStreak = await this.computeComplianceStreak(userId, activePlan);
    }

    return {
      type:               activePlan?.type ?? null,
      currentStreakHours: streakData.currentStreakHours,
      currentStreakDays:  Math.floor(streakData.currentStreakHours / 24),
      longestStreakHours: streakData.longestStreakHours,
      longestStreakDays:  Math.floor(streakData.longestStreakHours / 24),
      lastSmokingEvent:   streakData.lastSmokingEvent,
      complianceStreak,
    };
  }

  async computeComplianceStreak(userId: string, activePlan: any): Promise<number> {
    const steps = [...activePlan.steps].reverse();
    let streak  = 0;

    for (const step of steps) {
      const logs = await this.prisma.smokingLog.findMany({
        where: { userId, loggedAt: { gte: step.startDate, lte: step.endDate } },
        select: { quantity: true, loggedAt: true },
      });

      const byDay = new Map<string, number>();
      for (const log of logs) {
        const day = log.loggedAt.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + log.quantity);
      }

      const stepStart = new Date(step.startDate);
      const stepEnd   = new Date(Math.min(step.endDate.getTime(), Date.now()));
      let compliant   = true;

      for (let d = new Date(stepStart); d <= stepEnd; d.setDate(d.getDate() + 1)) {
        const day    = d.toISOString().slice(0, 10);
        const smoked = byDay.get(day) ?? 0;
        if (smoked > step.targetCigarettesPerDay) { compliant = false; break; }
      }

      if (compliant) streak++;
      else break;
    }

    return streak;
  }

  getTodayTarget(activePlan: any, todayLogs: number) {
    if (!activePlan) return null;

    if (activePlan.type === QuitPlanType.COLD_TURKEY) {
      return { allowed: 0, used: todayLogs, remaining: 0 };
    }

    const now         = new Date();
    const currentStep = activePlan.steps?.find(
      (s: any) => s.startDate <= now && s.endDate >= now,
    );
    if (!currentStep) return null;

    const allowed   = currentStep.targetCigarettesPerDay;
    const remaining = Math.max(0, allowed - todayLogs);
    return { allowed, used: todayLogs, remaining };
  }
}