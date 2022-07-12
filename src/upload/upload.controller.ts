import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { File } from '../types/file';
import { UserProfile } from '../types/user';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  uploadFile(
    @User() user: UserProfile,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Partial<File>> {
    return this.uploadService.uploadFile(file, user._id);
  }

  @Post('/array')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtGuard)
  uploadFiles(
    @User() user: UserProfile,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Array<Partial<File>>> {
    return this.uploadService.uploadFiles(files, user._id);
  }
}
