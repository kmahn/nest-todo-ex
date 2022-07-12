import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { MulterConfigService } from './multer-config/multer-config.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
