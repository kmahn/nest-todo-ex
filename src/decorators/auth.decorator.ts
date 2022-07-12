import { applyDecorators, UseFilters, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtExceptionFilter } from '../filters/jwt-exception.filter';

export function Auth() {
  return applyDecorators(UseGuards(JwtGuard), UseFilters(JwtExceptionFilter));
}
