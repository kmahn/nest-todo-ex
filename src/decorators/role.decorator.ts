import { SetMetadata } from '@nestjs/common';
import { TUserRole } from '../types/user';

export const Roles = (...roles: TUserRole[]) => SetMetadata('roles', roles);
