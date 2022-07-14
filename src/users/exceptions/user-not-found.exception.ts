import { NotFoundException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class UserNotFoundException
  extends NotFoundException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.USER_NOT_FOUND,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.USER_NOT_FOUND,
    };
  }
}
