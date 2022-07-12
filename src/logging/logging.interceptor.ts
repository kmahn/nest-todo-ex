import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `Response from ${method} ${url}\nresponse: ${JSON.stringify(data)}`
          ),
        ),
      );
  }
}
