import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BatchModule } from './batch/batch.module';
import { AppConfigModule } from './config/app-config.module';
import adminConfig from './config/factories/admin.config';
import { DatabaseModule } from './infra/database/database.module';
import { AuthDocument } from './infra/database/models/auth.model';
import { UserDocument } from './infra/database/models/user.model';
import { LoggingModule } from './logging/logging.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { TodosModule } from './todos/todos.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    LoggingModule,
    UploadModule,
    BatchModule,
    ConfigModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(
    @Inject(adminConfig.KEY) private config: ConfigType<typeof adminConfig>,
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthDocument.name) private authModel: Model<AuthDocument>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/**');
  }

  onApplicationBootstrap(): any {
    this.createAdmin();
  }

  private async createAdmin(): Promise<void> {
    const { email, name, phone, password } = this.config;
    const exAdmin = await this.userModel.findOne({ email });

    if (!exAdmin) {
      const user = await this.userModel.create({
        email,
        name,
        phone,
        role: 'admin',
      });
      const auth = await this.authModel.create({
        provider: 'local',
        providerId: String(user._id),
        password: hashSync(password, 12),
        user: user._id,
      });

      user.auth = auth._id;
      await user.save();
    }
  }
}
