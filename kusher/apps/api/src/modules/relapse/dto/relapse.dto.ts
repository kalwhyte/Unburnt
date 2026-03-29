import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRelapseDto {
  @IsInt() @Min(1)
  cigarettes?: number;

  @IsDateString()
  occurredAt?: string;

  @IsUUID() @IsOptional()
  triggerId?: string;

  @IsString() @IsOptional()
  note?: string;
}