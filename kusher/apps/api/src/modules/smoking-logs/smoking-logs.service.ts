import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSmokingLogDto, QuerySmokingLogDto } from './dto/smoking-log.dto';

@Injectable()
export class SmokingLogsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Create ───────────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateSmokingLogDto) {
    return this.prisma.smokingLog.create({
      data: {
        userId,
        quantity:  dto.quantity,
        loggedAt:  dto.loggedAt ? new Date(dto.loggedAt) : new Date(),
        mood:      dto.mood,
        triggerId: dto.triggerId,
        note:      dto.note,
      },
      include: { trigger: { select: { id: true, name: true } } },
    });
  }

  // ─── Find many (paginated + filtered) ────────────────────────────────────

  async findAll(userId: string, query: QuerySmokingLogDto) {
    const page  = query.page  ?? 1;
    const limit = query.limit ?? 20;
    const skip  = (page - 1) * limit;

    const where = {
      userId,
      ...(query.triggerId && { triggerId: query.triggerId }),
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
      this.prisma.smokingLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { loggedAt: 'desc' },
        include: { trigger: { select: { id: true, name: true } } },
      }),
      this.prisma.smokingLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ─── Find one ─────────────────────────────────────────────────────────────

  async findOne(userId: string, id: string) {
    const log = await this.prisma.smokingLog.findUnique({
      where: { id },
      include: { trigger: { select: { id: true, name: true } } },
    });

    if (!log)            throw new NotFoundException(`Smoking log ${id} not found`);
    if (log.userId !== userId) throw new ForbiddenException();

    return log;
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // ownership check
    await this.prisma.smokingLog.delete({ where: { id } });
  }

  // ─── Daily summary ────────────────────────────────────────────────────────

  async dailySummary(userId: string, query: { from?: string; to?: string }) {
    const logs = await this.prisma.smokingLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: query.from ? new Date(query.from) : this.daysAgo(30),
          lte: query.to   ? new Date(query.to)   : new Date(),
        },
      },
      select: { quantity: true, loggedAt: true },
      orderBy: { loggedAt: 'asc' },
    });

    // Group by calendar date
    const byDate = new Map<string, number>();
    for (const log of logs) {
      const day = log.loggedAt.toISOString().slice(0, 10);
      byDate.set(day, (byDate.get(day) ?? 0) + log.quantity);
    }

    return Array.from(byDate.entries()).map(([date, total]) => ({ date, total }));
  }

  // ─── Weekly aggregates ────────────────────────────────────────────────────

  async weeklyAggregates(userId: string) {
    const logs = await this.prisma.smokingLog.findMany({
      where: { userId, loggedAt: { gte: this.daysAgo(84) } }, // 12 weeks
      select: { quantity: true, loggedAt: true },
      orderBy: { loggedAt: 'asc' },
    });

    const byWeek = new Map<string, number>();
    for (const log of logs) {
      const week = this.isoWeek(log.loggedAt);
      byWeek.set(week, (byWeek.get(week) ?? 0) + log.quantity);
    }

    return Array.from(byWeek.entries()).map(([week, total]) => ({ week, total }));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private daysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  private isoWeek(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  }
}