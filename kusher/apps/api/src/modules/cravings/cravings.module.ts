import { Module } from '@nestjs/common';
import { CravingsController } from './cravings.controller';
import { CravingsService } from './cravings.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [CravingsController],
  providers: [CravingsService],
})
export class CravingsModule {}