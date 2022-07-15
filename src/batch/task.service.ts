import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { promises } from 'fs';
import { Model, Promise } from 'mongoose';
import { join } from 'path';
import multerConfig from '../config/factories/multer.config';
import { FileDocument } from '../infra/database/models/file.model';

@Injectable()
export class TaskService {
  constructor(
    private scheduleRegistry: SchedulerRegistry,
    private logger: Logger,
    @Inject(multerConfig.KEY) private config: ConfigType<typeof multerConfig>,
    @InjectModel(FileDocument.name) private fileModel: Model<FileDocument>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'unused file deletion',
    timeZone: 'Asia/Seoul',
  })
  async handleSchedule() {
    const beforeHour = new Date();
    beforeHour.setHours(beforeHour.getHours() - 1);
    const unusedFiles = await this.fileModel.find({
      refType: null,
      createdAt: { $lte: beforeHour },
    });

    // 파일 지우기
    const fileDeletionPromises = unusedFiles.map((file) => {
      const { key } = file;
      const filePath = join(this.config.dest, key);
      return promises.rm(filePath);
    });

    // DB에서 지우기
    const dbDeletionPromises = unusedFiles.map((file) =>
      this.fileModel.findByIdAndDelete(file._id),
    );

    await Promise.all([...fileDeletionPromises, ...dbDeletionPromises]);

    this.logger.debug(`Delete ${unusedFiles.length} Files`);
  }
}
