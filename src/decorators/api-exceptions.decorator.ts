import { HttpException as NestHttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiExceptionExample } from '../types/exception';
import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

interface HttpException extends NestHttpException, ApiExceptionExample {}

interface HttpExceptionConstructor {
  new (): HttpException;
}

function ApiException(ctrs: HttpExceptionConstructor[]): typeof ApiResponse[] {
  const exceptions = ctrs.map((ctr) => new ctr());

  const statuses = Array.from(
    new Set<number>(exceptions.map((exception) => exception.getStatus())),
  );

  const sameStatusExceptionArrays = statuses.map((status) =>
    exceptions.filter((exception) => status === exception.getStatus()),
  );

  const contents = sameStatusExceptionArrays.map((sameExceptions) =>
    sameExceptions.reduce(
      (pre, exception) =>
        Object.assign(pre, {
          [exception.example.code + ` - [${sameExceptions.length}]`]: {
            example: exception.example,
          },
        }),
      {},
    ),
  );

  return contents.map((content, index) =>
    ApiResponse({ content, status: statuses[index] }),
  );
}

export function ApiExceptions(...ctrs: HttpExceptionConstructor[]) {
  return applyDecorators(...ApiException(ctrs));
}
