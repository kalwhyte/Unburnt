import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RelapseController } from './relapse.controller';
import { RelapseService } from './relapse.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RelapseLoggingMiddleware } from './relapse.middleware';

@Module({
  controllers: [RelapseController],
  providers: [RelapseService, PrismaService],
  exports: [RelapseService],
})
export class RelapseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RelapseLoggingMiddleware)
      .forRoutes({ path: 'relapse/*', method: RequestMethod.ALL });
  }
}