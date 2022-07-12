import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import models from './models';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGO_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(models),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
