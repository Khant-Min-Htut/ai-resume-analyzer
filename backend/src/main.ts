import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      logger.fatal('JWT_SECRET environment variable is required in production');
      process.exit(1);
    } else {
      logger.warn(
        'JWT_SECRET is not set — using fallback. Set JWT_SECRET in .env for real use.',
      );
    }
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );
    next();
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}

void bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
