import { CreateBase } from './base';

export const FILE_REF_TYPE = ['Todo'] as const;

export type FileRefType = typeof FILE_REF_TYPE[number];

export interface File extends CreateBase {
  key: string;
  filename: string;
  mimetype: string;
  size: number;
  ref: string | null;
  refType: FileRefType | null;
}
