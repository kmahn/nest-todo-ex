import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { utilities as nestWinstonUtilities } from 'nest-winston/dist/winston.utilities';
import * as winston from 'winston';

export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonUtilities.format.nestLike('TodoApp', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
});

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Todo 애플리케이션')
    .setDescription('Todo 애플리케이션 APIs')
    .setVersion('1.0')
    .addTag('Todo Api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
