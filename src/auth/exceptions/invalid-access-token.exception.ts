import { UnauthorizedException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class InvalidAccessTokenException
  extends UnauthorizedException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.INVALID_ACCESS_TOKEN,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.INVALID_ACCESS_TOKEN,
    };
  }
}
