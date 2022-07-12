import { Logger, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [AuthModule],
  controllers: [TodosController],
  providers: [TodosService, Logger],
})
export class TodosModule {}
