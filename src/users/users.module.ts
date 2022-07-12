import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { commandHandlers } from './commands';
import { eventsHandlers } from './events';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    ...commandHandlers,
    ...eventsHandlers,
  ],
})
export class UsersModule {}
