import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { QuitPlansController } from './quit-plans.controller';
import { QuitPlansService } from './quit-plans.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { QuitPlansLoggingMiddleware } from './quit-plans.middleware';

@Module({
  controllers: [QuitPlansController],
  providers: [QuitPlansService, PrismaService],
  exports: [QuitPlansService],
})
export class QuitPlansModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QuitPlansLoggingMiddleware)
      .forRoutes({ path: 'quit-plans/*', method: RequestMethod.ALL });
  }
}