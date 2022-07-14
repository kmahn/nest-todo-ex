import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionResponse } from '../types/exception';
import { ErrorCodes } from '../errors/error-definition';

@Catch(HttpException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const { message } = request.authInfo as Error;
    let code = ErrorCodes.INVALID_ACCESS_TOKEN;
    if (message === 'jwt expired') {
      code = ErrorCodes.ACCESS_TOKEN_EXPIRED;
    }
    response.status(status).json({
      status: status,
      code,
    } as HttpExceptionResponse);
  }
}
