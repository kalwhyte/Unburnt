import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class QuitPlansLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.originalUrl.startsWith('/quit-plans')) return next();

    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(
        `\x1b[34m[QUIT-PLANS-REQ]\x1b[0m ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`,
      );
    });
    next();
  }
}
