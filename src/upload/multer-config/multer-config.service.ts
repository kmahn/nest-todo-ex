import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';
import multerConfig from '../../config/factories/multer.config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(
    @Inject(multerConfig.KEY) private config: ConfigType<typeof multerConfig>
  ) {}

  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    if (!existsSync(this.config.dest)) {
      mkdirSync(this.config.dest, { recursive: true });
    }

    const storage = diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.config.dest);
      },
      filename: (req, file, cb) => {
        const filename = `${uuidV4()}${extname(file.originalname)}`;
        console.log(filename);
        cb(null, filename);
      },
    });

    return { storage };
  }
}
