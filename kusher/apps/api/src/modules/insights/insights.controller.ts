import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  /**
   * GET /insights/summary
   * All insights in one call — use this for the insights screen
   */
  @Get('summary')
  async getSummary(@Request() req: any) {
    return this.insightsService.getSummary(req.user.userId);
  }

  /**
   * GET /insights/triggers
   * Most frequent triggers across smoking and craving logs
   */
  @Get('triggers')
  async getTriggerInsights(@Request() req: any) {
    return this.insightsService.getTriggerInsights(req.user.userId);
  }

  /**
   * GET /insights/mood
   * Most common moods when smoking, craving, and resisting
   */
  @Get('mood')
  async getMoodInsights(@Request() req: any) {
    return this.insightsService.getMoodInsights(req.user.userId);
  }

  /**
   * GET /insights/peak-hours
   * Hours of day with most smoking and craving activity
   */
  @Get('peak-hours')
  async getPeakHours(@Request() req: any) {
    return this.insightsService.getPeakHours(req.user.userId);
  }

  /**
   * GET /insights/craving-vs-smoking
   * Willpower ratio — cravings resisted vs smoked
   */
  @Get('craving-vs-smoking')
  async getCravingVsSmoking(@Request() req: any) {
    return this.insightsService.getCravingVsSmoking(req.user.userId);
  }

  /**
   * GET /insights/reduction
   * Week-over-week cigarette reduction trend — last 6 weeks
   */
  @Get('reduction')
  async getReductionTrend(@Request() req: any) {
    return this.insightsService.getReductionTrend(req.user.userId);
  }
}