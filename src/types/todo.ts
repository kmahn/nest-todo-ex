import { CreateBase } from './base';
import { File } from './file';

export interface Todo extends CreateBase {
  title: string;
  content: string;
  attachments: Array<File | string>;
  done: boolean;
  updatedAt: Date;
}
