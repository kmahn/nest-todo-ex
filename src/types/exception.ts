import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-definition';

export interface HttpExceptionResponse {
  status: HttpStatus;
  code: ErrorCodes;
  message?: string;
  data?: any;
}

export interface ApiExceptionExample {
  get example(): HttpExceptionResponse;
}
