import { applyDecorators } from '@nestjs/common';
import { HttpException as NestHttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiResponse } from '@nestjs/swagger';
import { ApiExceptionExample } from '../types/exception';

interface HttpException extends NestHttpException, ApiExceptionExample {}

interface HttpExceptionConstructor {
  new (): HttpException;
}

export function ApiException(ctr: HttpExceptionConstructor) {
  const exception = new ctr();
  return applyDecorators(
    ApiResponse({
      status: exception.getStatus(),
      schema: { example: exception.example },
    }),
  );
}
