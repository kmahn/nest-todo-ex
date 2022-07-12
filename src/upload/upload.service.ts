import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileDocument } from '../infra/database/models/file.model';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(FileDocument.name) private fileModel: Model<FileDocument>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<FileDocument> {
    return this.fileModel.create({
      filename: file.originalname,
      key: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      creator: userId,
    });
  }

  uploadFiles(
    files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<FileDocument[]> {
    return Promise.all(
      files.map((file) =>
        this.fileModel.create({
          filename: file.originalname,
          key: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          creator: userId,
        }),
      ),
    );
  }
}
