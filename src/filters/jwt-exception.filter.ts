import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const { message } = request.authInfo as Error;
    let code = 'invalid access-token';
    if (message === 'jwt expired') {
      code = 'access-token expired';
    }

    response.status(status).json({
      status,
      code,
    });
  }
}
