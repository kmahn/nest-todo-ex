import { UnauthorizedException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class InvalidRefreshTokenException
  extends UnauthorizedException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.INVALID_REFRESH_TOKEN,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.INVALID_REFRESH_TOKEN,
    };
  }
}
