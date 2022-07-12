import { registerAs } from '@nestjs/config';

export default registerAs('upload', () => ({
  dest: process.env.UPLOAD_DEST,
}));
