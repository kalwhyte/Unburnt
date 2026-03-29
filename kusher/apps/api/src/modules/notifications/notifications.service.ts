import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Notifications CRUD ───────────────────────────────────────────────────

  async findAll(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return { unreadCount, data: notifications };
  }

  async markOneRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException(`Notification ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data:  { read: true },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data:  { read: true },
    });
    return { message: 'All notifications marked as read' };
  }

  async remove(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    await this.prisma.notification.delete({ where: { id } });
  }

  // ─── Notification Preferences ─────────────────────────────────────────────

  async getPreferences(userId: string) {
    const prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      // Auto-create with defaults if not yet seeded
      return this.prisma.notificationPreference.create({ data: { userId } });
    }

    return prefs;
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferenceDto) {
    return this.prisma.notificationPreference.upsert({
      where:  { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });
  }
}