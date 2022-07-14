import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TUserRole } from '../../types/user';
import { UnauthorizedRequestException } from '../exceptions/unauthorized-request.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<TUserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request: any = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedRequestException();
    }

    if (!roles.includes(user.role)) {
      throw new UnauthorizedRequestException();
    }

    return true;
  }
}
