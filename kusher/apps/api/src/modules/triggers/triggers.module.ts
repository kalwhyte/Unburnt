import { Module } from '@nestjs/common';
import { TriggersController } from './triggers.controller';
import { TriggersService } from './triggers.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [TriggersController],
  providers: [TriggersService, PrismaService],
  exports: [TriggersService],
})
export class TriggersModule {}