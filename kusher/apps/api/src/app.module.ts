import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module'
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { envSchema } from './config/env.schema';
import { LoggerModule } from './common/logger/logger.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { SmokingLogsModule } from './modules/smoking-logs/smoking-logs.module';
import { TriggersModule } from './modules/triggers/triggers.module';
import { CravingsModule } from './modules/cravings/cravings.module';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    ProfilesModule,
    OnboardingModule,
    SmokingLogsModule,
    TriggersModule,
    CravingsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: envSchema,
    }),
    PrismaModule,
    AuthModule,
    ProfilesModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
