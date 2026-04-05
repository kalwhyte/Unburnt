import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './common/logger/winstonLoggerOptions';
import { AppModule } from './app.module';
import { Chalk } from 'chalk';

async function bootstrap() {
  const logger = new Logger('BOOT');
  const chalk = new Chalk();

  const app = await NestFactory.create(
    AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  }
);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  app.use((req: any, res: any, next: () => void) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(
        `\x1b[32m[REQ]\x1b[0m ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`,
      );
    });
    next();
  });

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log('\x1b[36m');
  console.log('=======================================');
  console.log('      SYSTEM INITIALIZED');
  console.log('=======================================');
  console.log(` SERVER RUNNING ON PORT ${port}`);
  console.log(chalk.green('[SUCCESS] Server started'));
  console.log(chalk.yellow('[WARN] Unauthorized request'));
  console.log(chalk.cyan('[INFO] New connection'));
  console.log(` URL: http://localhost:${port}`);
  console.log(chalk.green(' DATABASE: CONNECTED'));
  console.log(' STATUS: OPERATIONAL');
  console.log('=======================================');
  console.log('\x1b[0m');
}
bootstrap();
