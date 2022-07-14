import { UnauthorizedException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class InvalidPasswordException
  extends UnauthorizedException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.INVALID_PASSWORD,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.INVALID_PASSWORD,
    };
  }
}
