import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTriggerDto, AddUserTriggerDto } from './dto/trigger-log.dto';

@Injectable()
export class TriggersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Global Triggers (seed/reference list) ────────────────────────────────

  async findAll() {
    return this.prisma.trigger.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateTriggerDto) {
    if (!dto.name) throw new ConflictException('Trigger name is required');

    const existing = await this.prisma.trigger.findUnique({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException(`Trigger "${dto.name}" already exists`);

    return this.prisma.trigger.create({ data: { name: dto.name } });
  }

  // ─── User Triggers (which triggers this user has selected) ───────────────

  async getUserTriggers(userId: string) {
    const rows = await this.prisma.userTrigger.findMany({
      where: { userId },
      include: { trigger: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => r.trigger);
  }

  async addUserTrigger(userId: string, dto: AddUserTriggerDto) {
    const trigger = await this.prisma.trigger.findUnique({
      where: { id: dto.triggerId },
    });
    if (!trigger || !dto.triggerId) {
      throw new NotFoundException(`Trigger ${dto.triggerId} not found`);
    }

    try {
      return await this.prisma.userTrigger.create({
        data: { userId, triggerId: trigger.id },
        include: { trigger: { select: { id: true, name: true } } },
      });
    } catch (e) {
      // @@unique([userId, triggerId]) violation
      throw new ConflictException('Trigger already added');
    }
  }

  async removeUserTrigger(userId: string, triggerId: string) {
    const row = await this.prisma.userTrigger.findUnique({
      where: { userId_triggerId: { userId, triggerId } },
    });
    if (!row) throw new NotFoundException('User trigger not found');

    await this.prisma.userTrigger.delete({
      where: { userId_triggerId: { userId, triggerId } },
    });
  }
}