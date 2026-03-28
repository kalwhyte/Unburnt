import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateSmokingLogDto {
  @IsInt() @Min(1) @Max(100)
  quantity?: number;

  @IsDateString()
  loggedAt?: string;

  @IsString() @IsOptional()
  mood?: string;

  @IsUUID() @IsOptional()
  triggerId?: string;

  @IsString() @IsOptional()
  note?: string;
}

export class QuerySmokingLogDto {
  @IsDateString() @IsOptional()
  from?: string;

  @IsDateString() @IsOptional()
  to?: string;

  @IsUUID() @IsOptional()
  triggerId?: string;

  @IsInt() @Min(1) @IsOptional()
  page?: number;

  @IsInt() @Min(1) @Max(100) @IsOptional()
  limit?: number;
}