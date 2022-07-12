import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Model } from 'mongoose';
import { AuthDocument, AuthSchema } from './auth.model';
import { FileDocument, FileSchema } from './file.model';
import {
  RefreshTokenDocument,
  RefreshTokenSchema,
} from './refresh-token.model';
import { TodoDocument, TodoSchema } from './todo.model';
import { UserDocument, UserSchema } from './user.model';

const models: ModelDefinition[] = [
  { name: AuthDocument.name, schema: AuthSchema },
  { name: FileDocument.name, schema: FileSchema },
  { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
  { name: TodoDocument.name, schema: TodoSchema },
  { name: UserDocument.name, schema: UserSchema },
];

export interface Models {
  AuthDocument: Model<AuthDocument>;
  FileDocument: Model<FileDocument>;
  RefreshTokenDocument: Model<RefreshTokenDocument>;
  TodoDocument: Model<TodoDocument>;
  UserDocument: Model<UserDocument>;
}

export type ModelType = keyof Models;

export default models;
