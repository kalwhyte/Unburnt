import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';



export enum OnboardingStep {
  PERSONAL     = 'personal',
  SMOKING      = 'smoking',
  QUIT_GOAL    = 'quit_goal',
  MOTIVATION   = 'motivation',
}

// Step 1 — personal info
export class PersonalStepDto {
  @IsInt() @Min(1)
  age?: number;

  @IsString()
  gender?: string;

  @IsString()
  timezone?: string;
}

// Step 2 — smoking habits
export class SmokingStepDto {
  @IsInt() @Min(0)
  cigarettesPerDay?: number;

  @IsInt() @Min(0)
  yearsSmoking?: number;

  @IsNumber()
  packCost?: number;
}

// Step 3 — quit goal
export class QuitGoalStepDto {
  @IsString()
  quitGoal?: string;

  @IsDateString() @IsOptional()
  quitDate?: string;
}

// Step 4 — motivation / bio
export class MotivationStepDto {
  @IsString() @IsOptional()
  bio?: string;
}

// export class CompleteOnboardingDto {
  // @IsInt()
  // cigarettesPerDay?: number;

  // @IsOptional()
  // @IsInt()
  // yearsSmoking?: number;

  // @IsOptional()
  // @IsNumber()
  // packCost?: number;

  // @IsOptional()
  // @IsEnum(['QUIT_NOW', 'REDUCE', 'TRACK_ONLY'])
  // quitGoal?: 'QUIT_NOW' | 'REDUCE' | 'TRACK_ONLY';

  // @IsOptional()
  // @IsDateString()
  // quitDate?: string;

//   @IsOptional()
//   @IsString()
//   timezone?: string;
// }