import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { OnboardingLoggingMiddleware } from './onboarding.middleware';

@Module({
  imports: [PrismaModule],
  providers: [OnboardingService],
  controllers: [OnboardingController],
  exports: [OnboardingService],
})
export class OnboardingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OnboardingLoggingMiddleware)
      .forRoutes({ path: 'onboarding/*', method: RequestMethod.ALL });
  }
}