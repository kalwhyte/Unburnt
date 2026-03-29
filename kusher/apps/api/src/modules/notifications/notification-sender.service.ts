import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export type NotificationType =
  | 'MORNING_REMINDER'
  | 'TRIGGER_WINDOW'
  | 'MISSED_LOG'
  | 'STREAK_UPDATE'
  | 'MILESTONE'
  | 'RELAPSE_RECOVERY'
  | 'SYSTEM';

@Injectable()
export class NotificationSenderService {
  constructor(private readonly prisma: PrismaService) {}

  async send(userId: string, title: string, body: string, type: NotificationType) {
    return this.prisma.notification.create({
      data: { userId, title, body, type, read: false },
    });
  }

  async sendMorningReminder(userId: string) {
    return this.send(
      userId,
      'Good morning 🌅',
      'A new day, a fresh start. Stay smoke-free today.',
      'MORNING_REMINDER',
    );
  }

  async sendTriggerWindowAlert(userId: string, triggerName: string) {
    return this.send(
      userId,
      `Heads up — trigger window 🚨`,
      `You usually crave a cigarette around this time, often linked to "${triggerName}". Stay sharp.`,
      'TRIGGER_WINDOW',
    );
  }

  async sendMissedLogReminder(userId: string) {
    return this.send(
      userId,
      'Did you log today? 📋',
      "We haven't seen any logs from you today. Tracking keeps you honest — take 30 seconds.",
      'MISSED_LOG',
    );
  }

  async sendStreakUpdate(userId: string, days: number) {
    return this.send(
      userId,
      `${days} day${days === 1 ? '' : 's'} smoke-free 🔥`,
      days === 1
        ? 'Day one done. That took guts. Keep going.'
        : `${days} days without a cigarette. That's not luck — that's work.`,
      'STREAK_UPDATE',
    );
  }

  async sendMilestoneAlert(userId: string, milestoneName: string) {
    return this.send(
      userId,
      `Milestone reached 🏆`,
      `"${milestoneName}" — your body is thanking you right now.`,
      'MILESTONE',
    );
  }

  async sendRelapseRecovery(userId: string) {
    return this.send(
      userId,
      'A slip is not the end. 💪',
      'Restart now. Every quit attempt brings you closer — this one included.',
      'RELAPSE_RECOVERY',
    );
  }
}