import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @IsBoolean() @IsOptional()
  morningReminder?: boolean;

  @IsBoolean() @IsOptional()
  triggerWindowReminder?: boolean;

  @IsBoolean() @IsOptional()
  streakUpdates?: boolean;

  @IsBoolean() @IsOptional()
  milestoneAlerts?: boolean;

  @IsBoolean() @IsOptional()
  missedLogReminders?: boolean;
}