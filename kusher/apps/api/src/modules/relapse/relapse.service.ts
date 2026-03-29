import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRelapseDto } from './dto/relapse.dto';

@Injectable()
export class RelapseService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Log a relapse ────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateRelapseDto) {
    return this.prisma.$transaction(async (tx) => {
      // Save the smoking log record (relapse)
      const relapse = await tx.smokingLog.create({
        data: {
          userId,
          quantity:   dto.cigarettes ?? 1,
          loggedAt:   dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
          triggerId:  dto.triggerId ?? null,
          note:       dto.note ?? null,
        },
        include: { trigger: { select: { id: true, name: true } } },
      });

      // Fire a recovery notification
      await tx.notification.create({
        data: {
          userId,
          title: 'You can get back up. 💪',
          body:  'A relapse is not the end. Reset, reflect, and keep going.',
          type:  'RELAPSE_RECOVERY',
          read:  false,
        },
      });

      return relapse;
    });
  }

  // ─── Get all relapses ─────────────────────────────────────────────────────

  async findAll(userId: string) {
    const relapses = await this.prisma.smokingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      include: { trigger: { select: { id: true, name: true } } },
    });

    return {
      total: relapses.length,
      data:  relapses,
    };
  }

  // ─── Get a single relapse ─────────────────────────────────────────────────

  async findOne(userId: string, id: string) {
    const relapse = await this.prisma.smokingLog.findUnique({
      where: { id },
      include: { trigger: { select: { id: true, name: true } } },
    });

    if (!relapse || relapse.userId !== userId) {
      throw new NotFoundException(`Relapse ${id} not found`);
    }

    return relapse;
  }

  // ─── Delete a relapse ─────────────────────────────────────────────────────

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.smokingLog.delete({ where: { id } });
  }

  // ─── Relapse summary ──────────────────────────────────────────────────────

  async summary(userId: string) {
    const relapses = await this.prisma.smokingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
      select: { loggedAt: true, quantity: true, triggerId: true },
    });

    if (relapses.length === 0) {
      return {
        total:             0,
        totalCigarettes:   0,
        lastRelapseAt:     null,
        daysSinceRelapse:  null,
        mostCommonTrigger: null,
      };
    }

    const totalCigarettes = relapses.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const lastRelapse     = relapses[relapses.length - 1];
    const daysSince       = Math.floor(
      (Date.now() - lastRelapse.loggedAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Most common trigger
    const triggerCounts = new Map<string, number>();
    for (const r of relapses) {
      if (r.triggerId) {
        triggerCounts.set(r.triggerId, (triggerCounts.get(r.triggerId) ?? 0) + 1);
      }
    }

    let mostCommonTriggerId: string | null = null;
    let maxCount = 0;
    for (const [tid, count] of triggerCounts) {
      if (count > maxCount) { maxCount = count; mostCommonTriggerId = tid; }
    }

    const mostCommonTrigger = mostCommonTriggerId
      ? await this.prisma.trigger.findUnique({
          where:  { id: mostCommonTriggerId },
          select: { id: true, name: true },
        })
      : null;

    return {
      total:             relapses.length,
      totalCigarettes,
      lastRelapseAt:     lastRelapse.loggedAt,
      daysSinceRelapse:  daysSince,
      mostCommonTrigger,
    };
  }
}