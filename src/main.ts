import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { logger, setupSwagger } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService);
  const port = +(configService.get('PORT') || 3333);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
  Logger.log(`Server running on ${port}`);
}

bootstrap();
