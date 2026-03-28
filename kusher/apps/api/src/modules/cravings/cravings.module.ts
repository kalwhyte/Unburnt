import { Module } from '@nestjs/common';
import { CravingsController } from './cravings.controller';
import { CravingsService } from './cravings.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [CravingsController],
  providers: [CravingsService, PrismaService],
  exports: [CravingsService],
})
export class CravingsModule {}