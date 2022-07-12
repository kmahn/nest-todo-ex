import { HttpException } from '@nestjs/common';
import { ErrorCodes } from './error-definition';

export interface ErrorResponse {
  status?: number;
  code: ErrorCodes;
  message?: string;
  data?: any;
}

interface HttpExceptionConstructor {
  new (response: ErrorResponse): HttpException;
}

export function createHttpException(
  ctor: HttpExceptionConstructor,
  response: ErrorResponse,
) {
  return new ctor(response);
}
