
import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateSmokingLogDto {
  @IsOptional()
  @IsInt()
  cigarettes?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  smokedAt?: Date;
}