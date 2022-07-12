import { NotFoundException } from '@nestjs/common';
import { ErrorCodes } from '../../errors/error-definition';
import { ApiExceptionExample, HttpExceptionResponse } from '../../types/exception';

export class TodoNotFoundException
  extends NotFoundException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.TODO_NOT_FOUND,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.TODO_NOT_FOUND,
    };
  }
}
