import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CravingOutcome } from '@prisma/client';
import { CreateCravingLogDto, QueryCravingLogDto } from './dto/craving-log.dto';

@Injectable()
export class CravingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Create ───────────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateCravingLogDto) {
    return this.prisma.cravingLog.create({
      data: {
        userId,
        intensity:  dto.intensity ?? 5,
        outcome:    dto.outcome ?? CravingOutcome.UNRESOLVED,
        loggedAt:   dto.loggedAt ? new Date(dto.loggedAt) : new Date(),
        mood:       dto.mood,
        triggerId:  dto.triggerId,
        note:       dto.note,
      },
      include: { trigger: { select: { id: true, name: true } } },
    });
  }

  // ─── Find many (paginated + filtered) ────────────────────────────────────

  async findAll(userId: string, query: QueryCravingLogDto) {
    const page  = query.page  ?? 1;
    const limit = query.limit ?? 20;
    const skip  = (page - 1) * limit;

    const where = {
      userId,
      ...(query.triggerId && { triggerId: query.triggerId }),
      ...(query.outcome   && { outcome:   query.outcome   }),
      ...(query.from || query.to
        ? {
            loggedAt: {
              ...(query.from && { gte: new Date(query.from) }),
              ...(query.to   && { lte: new Date(query.to)   }),
            },
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.cravingLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { loggedAt: 'desc' },
        include: { trigger: { select: { id: true, name: true } } },
      }),
      this.prisma.cravingLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ─── Find one ─────────────────────────────────────────────────────────────

  async findOne(userId: string, id: string) {
    const log = await this.prisma.cravingLog.findUnique({
      where: { id },
      include: { trigger: { select: { id: true, name: true } } },
    });
    if (!log || log.userId !== userId) {
      throw new NotFoundException(`Craving log ${id} not found`);
    }
    return log;
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.cravingLog.delete({ where: { id } });
  }

  // ─── Outcome summary ──────────────────────────────────────────────────────

  async outcomeSummary(userId: string, query: { from?: string; to?: string }) {
    const logs = await this.prisma.cravingLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: query.from ? new Date(query.from) : this.daysAgo(30),
          lte: query.to   ? new Date(query.to)   : new Date(),
        },
      },
      select: { outcome: true },
    });

    const summary: Record<string, number> = { RESISTED: 0, SMOKED: 0, UNRESOLVED: 0 };
    for (const log of logs) if (log.outcome) summary[log.outcome]++;

    const total = logs.length;
    return {
      total,
      RESISTED:   summary.RESISTED,
      SMOKED:     summary.SMOKED,
      UNRESOLVED: summary.UNRESOLVED,
      resistRate: total > 0 ? Math.round((summary.RESISTED / total) * 100) : 0,
    };
  }

  // ─── Daily summary ────────────────────────────────────────────────────────

  async dailySummary(userId: string, query: { from?: string; to?: string }) {
    const logs = await this.prisma.cravingLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: query.from ? new Date(query.from) : this.daysAgo(30),
          lte: query.to   ? new Date(query.to)   : new Date(),
        },
      },
      select: { intensity: true, outcome: true, loggedAt: true },
      orderBy: { loggedAt: 'asc' },
    });

    const byDate = new Map<string, { count: number; avgIntensity: number; intensities: number[] }>();
    for (const log of logs) {
      const day = log.loggedAt.toISOString().slice(0, 10);
      if (!byDate.has(day)) byDate.set(day, { count: 0, avgIntensity: 0, intensities: [] });
      const entry = byDate.get(day)!;
      entry.count++;
      entry.intensities.push(log.intensity);
    }

    return Array.from(byDate.entries()).map(([date, entry]) => ({
      date,
      count: entry.count,
      avgIntensity: Math.round(entry.intensities.reduce((a, b) => a + b, 0) / entry.intensities.length),
    }));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private daysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }
}