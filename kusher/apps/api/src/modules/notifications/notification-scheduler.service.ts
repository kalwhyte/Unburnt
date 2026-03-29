import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationSenderService } from './notification-sender.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private readonly prisma:  PrismaService,
    private readonly sender:  NotificationSenderService,
  ) {}

  // ─── Morning reminder — 8AM daily ─────────────────────────────────────────

  @Cron('0 8 * * *')
  async sendMorningReminders() {
    this.logger.log('Running morning reminder job');

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { morningReminder: true },
      select: { userId: true },
    });

    await Promise.all(prefs.map((p) => this.sender.sendMorningReminder(p.userId)));
    this.logger.log(`Morning reminders sent to ${prefs.length} users`);
  }

  // ─── Predicted trigger window — 2PM daily ─────────────────────────────────
  // Finds each user's most common craving hour and fires if it matches now

  @Cron('0 * * * *') // runs every hour, checks if it matches user's peak
  async sendTriggerWindowAlerts() {
    const currentHour = new Date().getHours();

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { triggerWindowReminder: true },
      select: { userId: true },
    });

    for (const pref of prefs) {
      try {
        const peakHour = await this.getUserPeakCravingHour(pref.userId);
        if (peakHour === null || peakHour !== currentHour) continue;

        // Most common trigger for this user
        const topTrigger = await this.getTopUserTrigger(pref.userId);
        const triggerName = topTrigger ?? 'a known trigger';

        await this.sender.sendTriggerWindowAlert(pref.userId, triggerName);
      } catch (e: any) {
        this.logger.error(`Trigger window alert failed for ${pref.userId}: ${e?.message || e}`);
      }
    }
  }

  // ─── Missed log reminder — 9PM daily ──────────────────────────────────────

  @Cron('0 21 * * *')
  async sendMissedLogReminders() {
    this.logger.log('Running missed log reminder job');

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { missedLogReminders: true },
      select: { userId: true },
    });

    const todayStart = this.startOfDay();

    for (const pref of prefs) {
      try {
        const [smokingLogs, cravingLogs] = await Promise.all([
          this.prisma.smokingLog.count({
            where: { userId: pref.userId, loggedAt: { gte: todayStart } },
          }),
          this.prisma.cravingLog.count({
            where: { userId: pref.userId, loggedAt: { gte: todayStart } },
          }),
        ]);

        if (smokingLogs === 0 && cravingLogs === 0) {
          await this.sender.sendMissedLogReminder(pref.userId);
        }
      } catch (e : any) {
        this.logger.error(`Missed log reminder failed for ${pref.userId}: ${e.message}`);
      }
    }
  }

  // ─── Streak update — midnight daily ───────────────────────────────────────

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendStreakUpdates() {
    this.logger.log('Running streak update job');

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { streakUpdates: true },
      select: { userId: true },
    });

    for (const pref of prefs) {
      try {
        const lastLog = await this.prisma.smokingLog.findFirst({
          where: { userId: pref.userId },
          orderBy: { loggedAt: 'desc' },
        });

        if (!lastLog) continue;

        const streakDays = Math.floor(
          (Date.now() - lastLog.loggedAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (streakDays > 0) {
          await this.sender.sendStreakUpdate(pref.userId, streakDays);
        }
      } catch (e : any) {
        this.logger.error(`Streak update failed for ${pref.userId}: ${e.message}`);
      }
    }
  }

  // ─── Milestone check — every hour ─────────────────────────────────────────

  @Cron('0 * * * *')
  async checkMilestones() {
    const MILESTONE_HOURS = [8, 24, 48, 72, 168, 336, 720, 2160, 4380, 8760];

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { milestoneAlerts: true },
      select: { userId: true },
    });

    for (const pref of prefs) {
      try {
        const lastLog = await this.prisma.smokingLog.findFirst({
          where: { userId: pref.userId },
          orderBy: { loggedAt: 'desc' },
        });
        if (!lastLog) continue;

        const elapsedHours = (Date.now() - lastLog.loggedAt.getTime()) / 3600000;

        // Check if we just crossed a milestone in the last hour
        for (const hours of MILESTONE_HOURS) {
          if (elapsedHours >= hours && elapsedHours < hours + 1) {
            const milestoneNames: Record<number, string> = {
              8:    'Carbon monoxide clears',
              24:   'Oxygen levels recover',
              48:   'Nicotine leaves your body',
              72:   'Breathing becomes easier',
              168:  '1 week smoke-free',
              336:  '2 weeks smoke-free',
              720:  '1 month smoke-free',
              2160: '3 months smoke-free',
              4380: '6 months smoke-free',
              8760: '1 year smoke-free',
            };
            await this.sender.sendMilestoneAlert(pref.userId, milestoneNames[hours]);
          }
        }
      } catch (e : any) {
        this.logger.error(`Milestone check failed for ${pref.userId}: ${e.message}`);
      }
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async getUserPeakCravingHour(userId: string): Promise<number | null> {
    const logs = await this.prisma.cravingLog.findMany({
      where: { userId },
      select: { loggedAt: true },
    });
    if (logs.length === 0) return null;

    const hourCounts = new Array(24).fill(0);
    for (const log of logs) hourCounts[log.loggedAt.getHours()]++;

    return hourCounts.indexOf(Math.max(...hourCounts));
  }

  private async getTopUserTrigger(userId: string): Promise<string | null> {
    const userTriggers = await this.prisma.userTrigger.findMany({
      where: { userId },
      include: { trigger: { select: { name: true } } },
      take: 1,
    });
    return userTriggers[0]?.trigger.name ?? null;
  }

  private startOfDay(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}