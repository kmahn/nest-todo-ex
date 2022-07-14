import { BadRequestException } from '@nestjs/common';
import {
  ApiExceptionExample,
  HttpExceptionResponse,
} from '../../types/exception';
import { ErrorCodes } from '../../errors/error-definition';

export class EmailAlreadyInUseException
  extends BadRequestException
  implements ApiExceptionExample
{
  constructor() {
    super({
      code: ErrorCodes.EMAIL_ALREADY_IN_USE,
    });
  }

  get example(): HttpExceptionResponse {
    return {
      status: this.getStatus(),
      code: ErrorCodes.EMAIL_ALREADY_IN_USE,
    };
  }
}
