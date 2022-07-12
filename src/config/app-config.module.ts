import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import load from './factories';
import { validationSchema } from './validation-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(
          __dirname,
          '../../config',
          `.${process.env.NODE_ENV || 'development'}.env`,
        ),
      ],
      isGlobal: true,
      load,
      validationSchema,
    }),
  ],
})
export class AppConfigModule {}
