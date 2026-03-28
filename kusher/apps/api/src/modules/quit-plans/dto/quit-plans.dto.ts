import {
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { QuitPlanType } from '@prisma/client';

export class CreateQuitPlanDto {
  @IsEnum(QuitPlanType)
  type?: QuitPlanType;

  @IsDateString()
  startDate?: string;

  @IsDateString() @IsOptional()
  quitDate?: string;
}

export class UpdateStepTargetDto {
  @IsInt() @Min(0)
  targetCigarettesPerDay?: number;
}