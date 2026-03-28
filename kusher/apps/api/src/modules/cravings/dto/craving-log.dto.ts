import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { CravingOutcome } from '@prisma/client';

export class CreateCravingLogDto {
  @IsInt() @Min(1) @Max(10)
  intensity?: number;

  @IsEnum(CravingOutcome)
  outcome?: CravingOutcome;

  @IsDateString()
  loggedAt?: string;

  @IsString() @IsOptional()
  mood?: string;

  @IsUUID() @IsOptional()
  triggerId?: string;

  @IsString() @IsOptional()
  note?: string;
}

export class QueryCravingLogDto {
  @IsDateString() @IsOptional()
  from?: string;

  @IsDateString() @IsOptional()
  to?: string;

  @IsUUID() @IsOptional()
  triggerId?: string;

  @IsEnum(CravingOutcome) @IsOptional()
  outcome?: CravingOutcome;

  @IsInt() @Min(1) @IsOptional()
  page?: number;

  @IsInt() @Min(1) @Max(100) @IsOptional()
  limit?: number;
}