import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PersonalStepDto,
  SmokingStepDto,
  QuitGoalStepDto,
  MotivationStepDto,
} from './dto/complete-onboarding.dto';

@UseGuards(JwtAuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  private getUserId(req: Request): string {
    return (req as any).user.userId;
  }

  /**
   * GET /onboarding/progress
   * Returns which steps the user has completed
   */
  @Get('progress')
  async getProgress(@Request() req: any) {
    return this.onboardingService.getProgress(this.getUserId(req));
  }

  /**
   * POST /onboarding/step/personal
   * Step 1 — age, gender, timezone
   */
  @Post('step/personal')
  async stepPersonal(@Request() req: Request, @Body() dto: PersonalStepDto) {
    return this.onboardingService.savePersonalStep(this.getUserId(req), dto);
  }

  /**
   * POST /onboarding/step/smoking
   * Step 2 — cigarettes per day, years smoking, pack cost
   */
  @Post('step/smoking')
  async stepSmoking(@Request() req: Request, @Body() dto: SmokingStepDto) {
    return this.onboardingService.saveSmokingStep(this.getUserId(req), dto);
  }

  /**
   * POST /onboarding/step/quit-goal
   * Step 3 — quit goal and optional target quit date
   */
  @Post('step/quit-goal')
  async stepQuitGoal(@Request() req: Request, @Body() dto: QuitGoalStepDto) {
    return this.onboardingService.saveQuitGoalStep(this.getUserId(req), dto);
  }

  /**
   * POST /onboarding/step/motivation
   * Step 4 (final) — bio/motivation, completes onboarding
   * Seeds quit plan + welcome notification, marks user as onboarded
   */
  @Post('step/motivation')
  async stepMotivation(@Request() req: Request, @Body() dto: MotivationStepDto) {
    return this.onboardingService.saveMotivationStep(this.getUserId(req), dto);
  }
}