import { QuitGoal } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, MaxLength, Min } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsDateString()
  smokerSince?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cigarettesPerDay?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsSmoking?: number;

  @IsOptional()
  @IsNumber()
  packCost?: number;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  quitGoal?: QuitGoal;

  @IsOptional()
  @IsDateString()
  quitDate?: string;

}