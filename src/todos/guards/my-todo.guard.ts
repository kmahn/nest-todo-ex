import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHttpException } from '../../errors/create-error';
import { ErrorCodes } from '../../errors/error-definition';
import { TodoDocument } from '../../infra/database/models/todo.model';

@Injectable()
export class MyTodoGuard implements CanActivate {
  constructor(@InjectModel(TodoDocument.name) private todoModel: Model<TodoDocument>) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      params: { id }
    } = context.switchToHttp().getRequest();
    const todoDocument = await this.todoModel.findById(id);
    if (!todoDocument) {
      throw createHttpException(NotFoundException, {
        code: ErrorCodes.TODO_NOT_FOUND,
      });
    }
    if (String(todoDocument.creator) !== String(user._id)) {
      throw new ForbiddenException('권한이 없는 요청입니다.');
    }

    return true;
  }
}
