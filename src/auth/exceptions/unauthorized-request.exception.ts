import { ForbiddenException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class UnauthorizedRequestException
  extends ForbiddenException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.UNAUTHORIZED_REQUEST,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.UNAUTHORIZED_REQUEST,
    };
  }
}
