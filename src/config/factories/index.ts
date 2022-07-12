import { ConfigFactory } from '@nestjs/config';
import multerConfig from './multer.config';
import adminConfig from './admin.config';
import authConfig from './auth.config';

const load: ConfigFactory[] = [authConfig, adminConfig, multerConfig];

export default load;
