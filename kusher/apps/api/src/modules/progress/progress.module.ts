import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProgressLoggingMiddleware } from './progress.middleware';
import { StreakService } from './streak.service';
import { MoneyService } from './money.service';
import { HealthTimelineService } from './health-timeline.service';
import { WeeklySummaryService } from './weekly-summary.service';

@Module({
  controllers: [ProgressController],
  providers: [
    HealthTimelineService,
    MoneyService,
    WeeklySummaryService,
    PrismaService,
    ProgressService, 
    StreakService,    
  ],
  exports: [ProgressService, StreakService],
})
export class ProgressModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProgressLoggingMiddleware)
      .forRoutes({ path: 'progress/*', method: RequestMethod.ALL });
  }
}