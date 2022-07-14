import { HttpException as NestHttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiResponse } from '@nestjs/swagger';
import { ApiExceptionExample } from '../types/exception';

interface HttpException extends NestHttpException, ApiExceptionExample {}

interface HttpExceptionConstructor {
  new (): HttpException;
}

export function ApiException(...ctrs: HttpExceptionConstructor[]) {
  const exceptions = ctrs.map((ctr) => new ctr());
  const examples = exceptions.map((exception) => exception.example);
  return ApiResponse({
    status: exceptions[0].getStatus(),
    schema: { example: { examples } },
  });
}
