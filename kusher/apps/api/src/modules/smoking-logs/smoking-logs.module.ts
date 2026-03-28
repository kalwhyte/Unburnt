import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { SmokingLog } from './entities/smoking-log.entity';
import { SmokingLogsController } from './smoking-logs.controller';
import { SmokingLogsService } from './smoking-logs.service';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SmokingLogsLoggingMiddleware } from './smoking-logs.middleware';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  // imports: [TypeOrmModule.forFeature([SmokingLog])],
  controllers: [SmokingLogsController],
  providers: [SmokingLogsService],
})
export class SmokingLogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SmokingLogsLoggingMiddleware)
      .forRoutes({ path: 'smoking-logs/*', method: RequestMethod.ALL });
  }

}
