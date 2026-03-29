// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { QuitPlanType } from '@prisma/client';

// // ─── Health milestones (time in hours since last smoke) ───────────────────────
// const HEALTH_MILESTONES = [
//   { name: 'Blood pressure normalises',       hours: 0.33  },
//   { name: 'Carbon monoxide clears',          hours: 8     },
//   { name: 'Oxygen levels recover',           hours: 24    },
//   { name: 'Nicotine leaves your body',       hours: 48    },
//   { name: 'Taste & smell improve',           hours: 48    },
//   { name: 'Breathing becomes easier',        hours: 72    },
//   { name: '1 week smoke-free',               hours: 168   },
//   { name: '2 weeks smoke-free',              hours: 336   },
//   { name: '1 month smoke-free',              hours: 720   },
//   { name: 'Lung function improves 10%',      hours: 2160  },
//   { name: '3 months smoke-free',             hours: 2160  },
//   { name: '6 months smoke-free',             hours: 4380  },
//   { name: '1 year smoke-free',               hours: 8760  },
//   { name: 'Heart disease risk halved',       hours: 43800 },
//   { name: 'Stroke risk matches non-smoker',  hours: 43800 },
//   { name: 'Lung cancer risk halved',         hours: 87600 },
// ];

// @Injectable()
// export class ProgressService {
//   constructor(private readonly prisma: PrismaService) {}

//   async getDashboard(userId: string) {
//     const [profile, activePlan, streakData, todayLogs] = await Promise.all([
//       this.prisma.profile.findUnique({ where: { userId } }),
//       this.prisma.quitPlan.findFirst({
//         where: { userId, active: true },
//         include: { steps: { orderBy: { weekNumber: 'asc' } } },
//       }),
//       this.computeStreak(userId),
//       this.getTodaySmokingLogs(userId),
//     ]);

//     if (!profile) throw new NotFoundException('Profile not found');

//     const cigarettesPerPack = profile.cigarettesPerPack ?? 20;
//     const packCost          = Number(profile.packCost ?? 0);
//     const costPerCigarette  = cigarettesPerPack > 0 ? packCost / cigarettesPerPack : 0;

//     // Cigarettes avoided today
//     const smokeFreeHoursToday = Math.min(streakData.currentStreakHours, 24);
//     const cigarettesAvoidedToday = Math.floor(
//       (profile.cigarettesPerDay / 24) * smokeFreeHoursToday,
//     );
//     const moneySavedToday  = +(cigarettesAvoidedToday * costPerCigarette).toFixed(2);

//     // Total money saved
//     const totalCigarettesAvoided = Math.floor(
//       (profile.cigarettesPerDay / 24) * streakData.currentStreakHours,
//     );
//     const moneySavedTotal = +(totalCigarettesAvoided * costPerCigarette).toFixed(2);

//     // Cravings resisted today
//     const todayStart = this.startOfDay();
//     const cravingsToday = await this.prisma.cravingLog.findMany({
//       where: { userId, loggedAt: { gte: todayStart } },
//       select: { outcome: true },
//     });
//     const cravingsResistedToday = cravingsToday.filter(c => c.outcome === 'RESISTED').length;

//     // Next milestone
//     const nextMilestone = this.getNextMilestone(streakData.currentStreakHours);

//     // Today's target (GRADUAL plans)
//     const todayTarget = this.getTodayTarget(activePlan, todayLogs);

//     return {
//       data: {
//         currentStreakHours:      streakData.currentStreakHours,
//         longestStreakHours:      streakData.longestStreakHours,
//         cigarettesAvoidedToday,
//         moneySavedToday,
//         moneySavedTotal,
//         cravingsResistedToday,
//         nextMilestone,
//         todayTarget,
//       },
//     };
//   }
//   getNextMilestone(currentStreakHours: number) {
//     throw new Error('Method not implemented.');
//   }

//   async getStreak(userId: string) {
//     const profile    = await this.prisma.profile.findUnique({ where: { userId } });
//     const activePlan = await this.prisma.quitPlan.findFirst({
//       where: { userId, active: true },
//       include: { steps: { orderBy: { weekNumber: 'asc' } } },
//     });

//     const streakData = await this.computeStreak(userId);

//     // Compliance streak for GRADUAL users
//     let complianceStreak: number | null = null;
//     if (activePlan?.type === QuitPlanType.GRADUAL) {
//       complianceStreak = await this.computeComplianceStreak(userId, activePlan);
//     }

//     return {
//       type:                activePlan?.type ?? null,
//       currentStreakHours:  streakData.currentStreakHours,
//       currentStreakDays:   Math.floor(streakData.currentStreakHours / 24),
//       longestStreakHours:  streakData.longestStreakHours,
//       longestStreakDays:   Math.floor(streakData.longestStreakHours / 24),
//       lastSmokingEvent:    streakData.lastSmokingEvent,
//       complianceStreak,    // null for COLD_TURKEY users
//     };
//   }

//   async getMoneySaved(userId: string) {
//     const profile = await this.prisma.profile.findUnique({ where: { userId } });
//     if (!profile) throw new NotFoundException('Profile not found');

//     const streakData       = await this.computeStreak(userId);
//     const cigarettesPerPack = profile.cigarettesPerPack ?? 20;
//     const packCost          = Number(profile.packCost ?? 0);
//     const costPerCigarette  = cigarettesPerPack > 0 ? packCost / cigarettesPerPack : 0;

//     const avoided = (hours: number) =>
//       Math.floor((profile.cigarettesPerDay / 24) * hours);

//     const hoursToday  = Math.min(streakData.currentStreakHours, 24);
//     const hoursWeek   = Math.min(streakData.currentStreakHours, 168);
//     const hoursMonth  = Math.min(streakData.currentStreakHours, 720);
//     const hoursTotal  = streakData.currentStreakHours;

//     return {
//       costPerCigarette:        +costPerCigarette.toFixed(4),
//       packCost,
//       cigarettesPerPack,
//       cigarettesPerDay:        profile.cigarettesPerDay,
//       saved: {
//         today:  +(avoided(hoursToday)  * costPerCigarette).toFixed(2),
//         week:   +(avoided(hoursWeek)   * costPerCigarette).toFixed(2),
//         month:  +(avoided(hoursMonth)  * costPerCigarette).toFixed(2),
//         total:  +(avoided(hoursTotal)  * costPerCigarette).toFixed(2),
//       },
//       cigarettesAvoided: {
//         today:  avoided(hoursToday),
//         week:   avoided(hoursWeek),
//         month:  avoided(hoursMonth),
//         total:  avoided(hoursTotal),
//       },
//     };
//   }

//   async getHealthTimeline(userId: string) {
//     const streakData = await this.computeStreak(userId);
//     const elapsed    = streakData.currentStreakHours;

//     return {
//       currentStreakHours: elapsed,
//       milestones: HEALTH_MILESTONES.map((m) => ({
//         name:            m.name,
//         requiredHours:   m.hours,
//         achieved:        elapsed >= m.hours,
//         progressPercent: Math.min(100, Math.round((elapsed / m.hours) * 100)),
//         achievedAt:      elapsed >= m.hours && streakData.lastSmokingEvent
//           ? new Date(streakData.lastSmokingEvent.getTime() + m.hours * 3600000)
//           : null,
//       })),
//     };
//   }

//   async getWeeklySummary(userId: string) {
//     const now       = new Date();
//     const weekStart = new Date(now);
//     weekStart.setDate(now.getDate() - 6);
//     weekStart.setHours(0, 0, 0, 0);

//     const prevWeekStart = new Date(weekStart);
//     prevWeekStart.setDate(prevWeekStart.getDate() - 7);

//     const [thisWeekLogs, lastWeekLogs, thisWeekCravings] = await Promise.all([
//       this.prisma.smokingLog.findMany({
//         where: { userId, loggedAt: { gte: weekStart } },
//         select: { quantity: true, loggedAt: true },
//       }),
//       this.prisma.smokingLog.findMany({
//         where: { userId, loggedAt: { gte: prevWeekStart, lt: weekStart } },
//         select: { quantity: true },
//       }),
//       this.prisma.cravingLog.findMany({
//         where: { userId, loggedAt: { gte: weekStart } },
//         select: { outcome: true, intensity: true },
//       }),
//     ]);

//     const thisWeekTotal = thisWeekLogs.reduce((s, l) => s + l.quantity, 0);
//     const lastWeekTotal = lastWeekLogs.reduce((s, l) => s + l.quantity, 0);
//     const reduction     = lastWeekTotal > 0
//       ? Math.round(((lastWeekTotal - thisWeekTotal) / lastWeekTotal) * 100)
//       : null;

//     const resisted   = thisWeekCravings.filter(c => c.outcome === 'RESISTED').length;
//     const resistRate = thisWeekCravings.length > 0
//       ? Math.round((resisted / thisWeekCravings.length) * 100)
//       : null;

//     // Daily breakdown
//     const byDay: Record<string, number> = {};
//     for (const log of thisWeekLogs) {
//       const day = log.loggedAt.toISOString().slice(0, 10);
//       byDay[day] = (byDay[day] ?? 0) + log.quantity;
//     }

//     return {
//       period: {
//         from: weekStart.toISOString().slice(0, 10),
//         to:   now.toISOString().slice(0, 10),
//       },
//       smoking: {
//         thisWeek:        thisWeekTotal,
//         lastWeek:        lastWeekTotal,
//         reductionPercent: reduction,
//       },
//       cravings: {
//         total:      thisWeekCravings.length,
//         resisted,
//         resistRate,
//       },
//       dailyBreakdown: byDay,
//     };
//   }

//   private async computeStreak(userId: string) {
//     const profile    = await this.prisma.profile.findUnique({ where: { userId } });
//     const activePlan = await this.prisma.quitPlan.findFirst({
//       where: { userId, active: true },
//     });

//     // Last smoking event — most recent smoking log
//     const lastLog = await this.prisma.smokingLog.findFirst({
//       where: { userId },
//       orderBy: { loggedAt: 'desc' },
//     });

//     // Streak start = later of (last smoking log | plan start date | quit date)
//     let streakStart: Date | null = null;

//     if (lastLog) {
//       streakStart = lastLog.loggedAt;
//     } else if (activePlan?.quitDate) {
//       streakStart = activePlan.quitDate;
//     } else if (activePlan?.startDate) {
//       streakStart = activePlan.startDate;
//     } else if (profile?.quitDate) {
//       streakStart = profile.quitDate;
//     }

//     const now                = new Date();
//     const currentStreakHours = streakStart
//       ? Math.max(0, (now.getTime() - streakStart.getTime()) / 3600000)
//       : 0;

//     // Longest streak — gap between consecutive smoking logs
//     const allLogs = await this.prisma.smokingLog.findMany({
//       where: { userId },
//       orderBy: { loggedAt: 'asc' },
//       select: { loggedAt: true },
//     });

//     let longestStreakHours = currentStreakHours;
//     for (let i = 1; i < allLogs.length; i++) {
//       const gap = (allLogs[i].loggedAt.getTime() - allLogs[i - 1].loggedAt.getTime()) / 3600000;
//       if (gap > longestStreakHours) longestStreakHours = gap;
//     }

//     return {
//       currentStreakHours: +currentStreakHours.toFixed(2),
//       longestStreakHours: +longestStreakHours.toFixed(2),
//       lastSmokingEvent:   lastLog?.loggedAt ?? null,
//     };
//   }

//   private async computeComplianceStreak(userId: string, activePlan: any): Promise<number> {
//     // Walk back through each step and check if daily logs stayed within target
//     const steps = [...activePlan.steps].reverse(); // most recent first
//     let streak  = 0;

//     for (const step of steps) {
//       const logs = await this.prisma.smokingLog.findMany({
//         where: { userId, loggedAt: { gte: step.startDate, lte: step.endDate } },
//         select: { quantity: true, loggedAt: true },
//       });

//       // Group by day
//       const byDay = new Map<string, number>();
//       for (const log of logs) {
//         const day = log.loggedAt.toISOString().slice(0, 10);
//         byDay.set(day, (byDay.get(day) ?? 0) + log.quantity);
//       }

//       // Check each day in the step
//       const stepStart = new Date(step.startDate);
//       const stepEnd   = new Date(Math.min(step.endDate.getTime(), Date.now()));
//       let compliant   = true;

//       for (let d = new Date(stepStart); d <= stepEnd; d.setDate(d.getDate() + 1)) {
//         const day   = d.toISOString().slice(0, 10);
//         const smoked = byDay.get(day) ?? 0;
//         if (smoked > step.targetCigarettesPerDay) { compliant = false; break; }
//       }

//       if (compliant) streak++;
//       else break;
//     }

//     return streak;
//   }

//   private getTodayTarget(activePlan: any, todayLogs: number) {
//     if (!activePlan) return null;

//     if (activePlan.type === QuitPlanType.COLD_TURKEY) {
//       return { allowed: 0, used: todayLogs, remaining: Math.max(0, -todayLogs) };
//     }

//     const now         = new Date();
//     const currentStep = activePlan.steps?.find(
//       (s: any) => s.startDate <= now && s.endDate >= now,
//     );

//     if (!currentStep) return null;

//     const allowed   = currentStep.targetCigarettesPerDay;
//     const remaining = Math.max(0, allowed - todayLogs);
//     return { allowed, used: todayLogs, remaining };
//   }

//   private async getTodaySmokingLogs(userId: string): Promise<number> {
//     const logs = await this.prisma.smokingLog.findMany({
//       where: { userId, loggedAt: { gte: this.startOfDay() } },
//       select: { quantity: true },
//     });
//     return logs.reduce((s, l) => s + l.quantity, 0);
//   }

//   private startOfDay(): Date {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StreakService } from './streak.service';
import { MoneyService } from './money.service';
import { HealthTimelineService } from './health-timeline.service';
import { WeeklySummaryService } from './weekly-summary.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma:                PrismaService,
    private readonly streakService:         StreakService,
    private readonly moneyService:          MoneyService,
    private readonly healthTimelineService: HealthTimelineService,
    private readonly weeklySummaryService:  WeeklySummaryService,
  ) {}

  // ─── Dashboard — single call for the home screen ─────────────────────────

  async getDashboard(userId: string) {
    const [profile, activePlan, streakData, todayLogs] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.quitPlan.findFirst({
        where: { userId, active: true },
        include: { steps: { orderBy: { weekNumber: 'asc' } } },
      }),
      this.streakService.computeStreak(userId),
      this.getTodaySmokingLogs(userId),
    ]);

    if (!profile) throw new NotFoundException('Profile not found');

    const cigarettesPerPack = profile.cigarettesPerPack ?? 20;
    const packCost          = Number(profile.packCost ?? 0);
    const costPerCigarette  = cigarettesPerPack > 0 ? packCost / cigarettesPerPack : 0;

    const smokeFreeHoursToday    = Math.min(streakData.currentStreakHours, 24);
    const cigarettesAvoidedToday = Math.floor((profile.cigarettesPerDay / 24) * smokeFreeHoursToday);
    const moneySavedToday        = +(cigarettesAvoidedToday * costPerCigarette).toFixed(2);

    const totalCigarettesAvoided = Math.floor((profile.cigarettesPerDay / 24) * streakData.currentStreakHours);
    const moneySavedTotal        = +(totalCigarettesAvoided * costPerCigarette).toFixed(2);

    const todayStart    = this.startOfDay();
    const cravingsToday = await this.prisma.cravingLog.findMany({
      where: { userId, loggedAt: { gte: todayStart } },
      select: { outcome: true },
    });
    const cravingsResistedToday = cravingsToday.filter((c) => c.outcome === 'RESISTED').length;

    const nextMilestone = this.healthTimelineService.getNextMilestone(streakData.currentStreakHours);
    const todayTarget   = this.streakService.getTodayTarget(activePlan, todayLogs);

    return {
      data: {
        currentStreakHours:     streakData.currentStreakHours,
        longestStreakHours:     streakData.longestStreakHours,
        cigarettesAvoidedToday,
        moneySavedToday,
        moneySavedTotal,
        cravingsResistedToday,
        nextMilestone,
        todayTarget,
      },
    };
  }

  // ─── Delegates ────────────────────────────────────────────────────────────

  getStreak(userId: string)         { return this.streakService.getStreakSummary(userId);        }
  getMoneySaved(userId: string)     { return this.moneyService.getMoneySaved(userId);            }
  getHealthTimeline(userId: string) { return this.healthTimelineService.getHealthTimeline(userId); }
  getWeeklySummary(userId: string)  { return this.weeklySummaryService.getWeeklySummary(userId); }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async getTodaySmokingLogs(userId: string): Promise<number> {
    const logs = await this.prisma.smokingLog.findMany({
      where: { userId, loggedAt: { gte: this.startOfDay() } },
      select: { quantity: true },
    });
    return logs.reduce((s, l) => s + l.quantity, 0);
  }

  private startOfDay(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}