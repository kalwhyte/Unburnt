import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateSupportContactDto {
  @IsString()
  name?: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  relationship?: string;
}

export class UpdateSupportContactDto {
  @IsString() @IsOptional()
  name?: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  relationship?: string;
}