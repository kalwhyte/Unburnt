import { IsString, IsUUID } from 'class-validator';

export class CreateTriggerDto {
  @IsString()
  name?: string;
}

export class AddUserTriggerDto {
  @IsUUID()
  triggerId?: string;

}