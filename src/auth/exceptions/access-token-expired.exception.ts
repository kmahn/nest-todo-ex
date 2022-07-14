import { UnauthorizedException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class AccessTokenExpiredException
  extends UnauthorizedException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.ACCESS_TOKEN_EXPIRED,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.ACCESS_TOKEN_EXPIRED,
    };
  }
}
