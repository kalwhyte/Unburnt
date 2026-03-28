import { Module } from '@nestjs/common';
import { QuitPlansController } from './quit-plans.controller';
import { QuitPlansService } from './quit-plans.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [QuitPlansController],
  providers: [QuitPlansService, PrismaService],
  exports: [QuitPlansService],
})
export class QuitPlansModule {}