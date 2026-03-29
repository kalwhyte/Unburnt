import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    return this.progressService.getDashboard(req.user.userId);
  }

  @Get('streak')
  async getStreak(@Request() req: any) {
    return this.progressService.getStreak(req.user.userId);
  }

  @Get('money-saved')
  async getMoneySaved(@Request() req: any) {
    return this.progressService.getMoneySaved(req.user.userId);
  }

  @Get('health-timeline')
  async getHealthTimeline(@Request() req: any) {
    return this.progressService.getHealthTimeline(req.user.userId);
  }

  @Get('weekly-summary')
  async getWeeklySummary(@Request() req: any) {
    return this.progressService.getWeeklySummary(req.user.userId);
  }
}