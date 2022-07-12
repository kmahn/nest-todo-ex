import { IdBase } from './base';

export const AUTH_PROVIDERS = ['kakao', 'naver', 'local'] as const;
export type TAuthProvider = typeof AUTH_PROVIDERS[number];

export interface Auth extends IdBase {
  provider: TAuthProvider;
  providerId: string;
  password: string;
  user: string;
  createdAt: Date;
}
