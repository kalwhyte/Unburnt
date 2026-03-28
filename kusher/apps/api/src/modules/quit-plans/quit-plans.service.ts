import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QuitPlanType } from '@prisma/client';
import { CreateQuitPlanDto, UpdateStepTargetDto } from './dto/quit-plans.dto';

@Injectable()
export class QuitPlansService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Get active plan + steps ──────────────────────────────────────────────

  async getActivePlan(userId: string) {
    const plan = await this.prisma.quitPlan.findFirst({
      where: { userId, active: true },
      include: {
        steps: { orderBy: { weekNumber: 'asc' } },
      },
    });

    if (!plan) throw new NotFoundException('No active quit plan found');

    // Annotate which week the user is currently on
    const now = new Date();
    const currentStep = plan.steps.find(
      (s) => s.startDate <= now && s.endDate >= now,
    ) ?? null;

    return { ...plan, currentStep };
  }

  // ─── Get all plans (history) ──────────────────────────────────────────────

  async getAllPlans(userId: string) {
    return this.prisma.quitPlan.findMany({
      where: { userId },
      include: { steps: { orderBy: { weekNumber: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Create a new plan manually ───────────────────────────────────────────

  async create(userId: string, dto: CreateQuitPlanDto) {
    // Fetch current cigarettes/day from profile
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Complete your profile before creating a quit plan');

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();

    return this.prisma.$transaction(async (tx) => {
      // Deactivate all existing active plans
      await tx.quitPlan.updateMany({
        where: { userId, active: true },
        data: { active: false },
      });

      // Create the new plan
      const plan = await tx.quitPlan.create({
        data: {
          userId,
          type: dto.type ?? QuitPlanType.COLD_TURKEY,
          startDate,
          quitDate: dto.quitDate ? new Date(dto.quitDate) : null,
          active: true,
        },
      });

      // Auto-generate weekly steps for GRADUAL plans
      if (dto.type === QuitPlanType.GRADUAL && profile.cigarettesPerDay > 0) {
        await this.seedGradualSteps(tx, plan.id, profile.cigarettesPerDay, startDate);
      }

      return tx.quitPlan.findUnique({
        where: { id: plan.id },
        include: { steps: { orderBy: { weekNumber: 'asc' } } },
      });
    });
  }

  // ─── Deactivate active plan ───────────────────────────────────────────────

  async deactivate(userId: string) {
    const plan = await this.prisma.quitPlan.findFirst({
      where: { userId, active: true },
    });
    if (!plan) throw new NotFoundException('No active quit plan to deactivate');

    return this.prisma.quitPlan.update({
      where: { id: plan.id },
      data: { active: false },
    });
  }

  // ─── Switch to a previous plan ────────────────────────────────────────────

  async switchPlan(userId: string, planId: string) {
    const target = await this.prisma.quitPlan.findUnique({
      where: { id: planId },
    });

    if (!target || target.userId !== userId) {
      throw new NotFoundException(`Quit plan ${planId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.quitPlan.updateMany({
        where: { userId, active: true },
        data: { active: false },
      });

      return tx.quitPlan.update({
        where: { id: planId },
        data: { active: true },
        include: { steps: { orderBy: { weekNumber: 'asc' } } },
      });
    });
  }

  // ─── Update a step's target ───────────────────────────────────────────────

  async updateStep(userId: string, stepId: string, dto: UpdateStepTargetDto) {
    const step = await this.prisma.quitPlanStep.findUnique({
      where: { id: stepId },
      include: { quitPlan: true },
    });

    if (!step || step.quitPlan.userId !== userId) {
      throw new NotFoundException(`Step ${stepId} not found`);
    }

    return this.prisma.quitPlanStep.update({
      where: { id: stepId },
      data: { targetCigarettesPerDay: dto.targetCigarettesPerDay },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async seedGradualSteps(
    tx: any,
    quitPlanId: string,
    cigarettesPerDay: number,
    startDate: Date,
  ) {
    const WEEKS = 4;
    const weeklyReduction = Math.ceil(cigarettesPerDay / WEEKS);
    const steps = [];

    for (let week = 1; week <= WEEKS; week++) {
      const target = Math.max(0, cigarettesPerDay - weeklyReduction * week);
      const stepStart = new Date(startDate);
      stepStart.setDate(stepStart.getDate() + (week - 1) * 7);
      const stepEnd = new Date(stepStart);
      stepEnd.setDate(stepEnd.getDate() + 6);

      steps.push({
        quitPlanId,
        weekNumber: week,
        targetCigarettesPerDay: target,
        startDate: stepStart,
        endDate: stepEnd,
      });
    }

    await tx.quitPlanStep.createMany({ data: steps });
  }
}