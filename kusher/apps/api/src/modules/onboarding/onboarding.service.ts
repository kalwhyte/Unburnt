import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QuitGoal, QuitPlanType } from '@prisma/client';
import {
  PersonalStepDto,
  SmokingStepDto,
  QuitGoalStepDto,
  MotivationStepDto,
} from './dto/complete-onboarding.dto';
import chalk from 'chalk';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  // ─── Step 1: Personal Info ────────────────────────────────────────────────

  async savePersonalStep(userId: string, dto: PersonalStepDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { 
        userId, 
        ...dto,
        cigarettesPerDay: 0,
        quitGoal: QuitGoal.QUIT_NOW,
      },
      update: { ...dto },
    });
  }

  // ─── Step 2: Smoking Habits ───────────────────────────────────────────────

  async saveSmokingStep(userId: string, dto: SmokingStepDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { 
        userId, 
        ...dto,
        quitGoal: QuitGoal.QUIT_NOW,
        cigarettesPerDay: dto.cigarettesPerDay ?? 0,
      },
      update: { ...dto },
    });
  }

  // ─── Step 3: Quit Goal ────────────────────────────────────────────────────

  async saveQuitGoalStep(userId: string, dto: QuitGoalStepDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        quitGoal: dto.quitGoal as QuitGoal,
        cigarettesPerDay: 0,
        quitDate: dto.quitDate ? new Date(dto.quitDate) : undefined,
      },
      update: {
        quitGoal: dto.quitGoal as QuitGoal,
        quitDate: dto.quitDate ? new Date(dto.quitDate) : undefined,
      },
    });
  }

  // ─── Step 4: Motivation — final step, completes onboarding ───────────────

  async saveMotivationStep(userId: string, dto: MotivationStepDto) {
    // Validate all required profile fields are present before completing
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (profile?.cigarettesPerDay === undefined || profile?.quitGoal === undefined) {
      throw new BadRequestException(
        'Complete all previous onboarding steps before finishing.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Write motivation step into profile
      console.log(chalk.blue("updating bio..."));
      await tx.profile.update({
        where: { userId },
        data: { bio: dto.bio },
      });

      // Seed initial quit plan
      const quitPlan =  await tx.quitPlan.create({
        data: {
          userId,
          startDate: new Date(),
          quitDate: profile.quitDate,
          type: this.deriveStrategy(profile.cigarettesPerDay),
        },
      });

      // Create notification preferences (settings)
      await tx.notificationPreference.create({
        data: { userId },
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId,
          title: 'Welcome to Unburnt 🎉',
          body: "Your quit journey starts now. You've got this.",
          type: 'SYSTEM',
        },
      });

      // Mark user as onboarded
      await tx.user.update({
        where: { id: userId },
        data: { isOnboarded: true},
      });

      return { message: 'Onboarding complete' };
    });
  }

  // ─── Progress: how far has the user gotten? ───────────────────────────────

  async getProgress(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return {
      isOnboarded: !!profile?.bio, // Use bio presence as a proxy for completion
      steps: {
        personal:   !!(profile?.age !== undefined && profile?.gender && profile?.timezone),
        smoking:    !!(profile?.cigarettesPerDay !== undefined && profile?.yearsSmoking !== undefined),
        quit_goal:  !!profile?.quitGoal,
        motivation: !!profile?.bio,
      },
    };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private deriveStrategy(cigarettesPerDay: number): QuitPlanType {
    if (cigarettesPerDay <= 5)  return 'COLD_TURKEY';
    if (cigarettesPerDay <= 15) return 'GRADUAL';
    return QuitPlanType.GRADUAL; // Nicotine Replacement Therapy
  }
}