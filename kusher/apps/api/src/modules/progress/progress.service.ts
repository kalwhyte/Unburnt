
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