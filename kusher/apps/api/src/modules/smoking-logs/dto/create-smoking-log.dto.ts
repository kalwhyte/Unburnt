
import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateSmokingLogDto {
  @IsOptional()
  @IsInt()
  cigarettes?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsDateString()
  loggedAt?: Date;

  @IsOptional()
  @IsString()
  triggerId?: string;
}