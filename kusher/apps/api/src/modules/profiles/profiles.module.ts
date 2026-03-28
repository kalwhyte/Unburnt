import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProfileService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ProfileLoggingMiddleware } from './profile.middleware';

@Module({
  imports: [PrismaModule],
  providers: [ProfileService],
  controllers: [ProfilesController],
  exports: [ProfileService],
})
export class ProfilesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProfileLoggingMiddleware)
      .forRoutes({ path: 'profiles/*', method: RequestMethod.ALL });
  }
}