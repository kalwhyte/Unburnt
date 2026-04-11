import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationSenderService } from './notification-sender.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationLoggingMiddleware } from './notification.middleware';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationSenderService,
    NotificationSchedulerService,
  ],
  exports: [NotificationSenderService],
})
export class NotificationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NotificationLoggingMiddleware)
      .forRoutes('notifications/*');
  }
}