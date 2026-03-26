import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './winstonLoggerOptions';

@Module({
  imports: [WinstonModule.forRoot(winstonLoggerOptions)],
})
export class LoggerModule {}