import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuitPlansService } from './quit-plans.service';
import { CreateQuitPlanDto, UpdateStepTargetDto } from './dto/quit-plans.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('quit-plans')
export class QuitPlansController {
  constructor(private readonly quitPlansService: QuitPlansService) {}

  /**
   * GET /quit-plans
   * All plans for the user (history)
   */
  @Get()
  async getAllPlans(@Request() req: any) {
    return this.quitPlansService.getAllPlans(req.user.userId);
  }

  /**
   * GET /quit-plans/active
   * Active plan + steps, annotated with current week
   */
  @Get('active')
  async getActivePlan(@Request() req: any) {
    return this.quitPlansService.getActivePlan(req.user.userId);
  }

  /**
   * POST /quit-plans
   * Create a new plan — deactivates current, auto-generates steps if GRADUAL
   */
  @Post()
  async create(@Request() req: any, @Body() dto: CreateQuitPlanDto) {
    return this.quitPlansService.create(req.user.userId, dto);
  }

  /**
   * PATCH /quit-plans/deactivate
   * Deactivate the current active plan
   */
  @Patch('deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Request() req: any) {
    return this.quitPlansService.deactivate(req.user.userId);
  }

  /**
   * PATCH /quit-plans/:planId/switch
   * Switch to a previous plan by ID — deactivates current
   */
  @Patch(':planId/switch')
  async switchPlan(@Request() req: any, @Param('planId') planId: string) {
    return this.quitPlansService.switchPlan(req.user.userId, planId);
  }

  /**
   * PATCH /quit-plans/steps/:stepId
   * Update the target cigarettes/day for a specific week step
   */
  @Patch('steps/:stepId')
  async updateStep(
    @Request() req: any,
    @Param('stepId') stepId: string,
    @Body() dto: UpdateStepTargetDto,
  ) {
    return this.quitPlansService.updateStep(req.user.userId, stepId, dto);
  }
}