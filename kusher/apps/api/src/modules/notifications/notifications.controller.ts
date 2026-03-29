import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications
   * All notifications, unread first — includes unreadCount
   */
  @Get()
  async findAll(@Request() req: any) {
    return this.notificationsService.findAll(req.user.userId);
  }

  /**
   * PATCH /notifications/read-all
   * Mark all notifications as read
   */
  @Patch('read-all')
  async markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  /**
   * GET /notifications/preferences
   * Get notification preferences
   */
  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  /**
   * PATCH /notifications/preferences
   * Update notification preferences
   */
  @Patch('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.userId, dto);
  }

  /**
   * PATCH /notifications/:id/read
   * Mark a single notification as read
   */
  @Patch(':id/read')
  async markOneRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markOneRead(req.user.userId, id);
  }

  /**
   * DELETE /notifications/:id
   * Delete a notification
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.remove(req.user.userId, id);
  }
}