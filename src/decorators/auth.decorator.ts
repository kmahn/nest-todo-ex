import { applyDecorators, UseFilters, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtExceptionFilter } from '../filters/jwt-exception.filter';
import { ApiException } from './api-exception.decorator';
import { InvalidAccessTokenException } from '../auth/exceptions/invalid-access-token.exception';
import { AccessTokenExpiredException } from '../auth/exceptions/access-token-expired.exception';

export function Auth() {
  return applyDecorators(
    UseGuards(JwtGuard),
    UseFilters(JwtExceptionFilter),
    ApiException(AccessTokenExpiredException, InvalidAccessTokenException),
  );
}
