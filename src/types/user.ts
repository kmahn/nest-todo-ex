import { IdBase } from './base';

export const USER_ROLES = ['member', 'admin'] as const;
export type TUserRole = typeof USER_ROLES[number];

export interface User extends IdBase {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: TUserRole;
  auth: string | null;
  joinedAt: Date;
}

export interface UserProfile {
  _id: string;
  role: TUserRole;
}
