import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SupportContactsController } from './support-contacts.controller';
import { SupportContactsService } from './support-contacts.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SupportContactLoggingMiddleware } from './support-contacts.middleware';

@Module({
  controllers: [SupportContactsController],
  providers: [SupportContactsService, PrismaService],
  exports: [SupportContactsService],
})
export class SupportContactsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SupportContactLoggingMiddleware)
      .forRoutes({ path: 'support-contacts/*', method: RequestMethod.ALL });
  }

}