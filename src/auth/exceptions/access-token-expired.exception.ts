import { UnauthorizedException } from '@nestjs/common';
import { ApiExceptionExample } from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class ExpiredAccessTokenException
  extends UnauthorizedException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.ACCESS_TOKEN_EXPIRED,
    });
  }

  get example(): HttpExceptionResponse {
    return undefined;
  }
}
