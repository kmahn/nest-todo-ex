import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcrypt';
import mongoose, { Document } from 'mongoose';
import { Auth, AUTH_PROVIDERS, TAuthProvider } from '../../../types/auth';

type FieldType = Pick<Auth, 'providerId' | 'password' | 'user'> &
  Partial<Pick<Auth, 'provider'>>;

@Schema({
  collection: 'auth',
  timestamps: { createdAt: true, updatedAt: false },
})
export class AuthDocument extends Document implements FieldType {
  @Prop({ type: String, enum: AUTH_PROVIDERS, default: 'local' })
  provider?: TAuthProvider;

  // provider 가 local 일 경우 User 의 _id
  @Prop({ type: String, required: true })
  providerId: string;

  @Prop({ type: String })
  hashedPassword: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: string;

  password: string;
  validatePassword: (password: string) => boolean;
}

export const AuthSchema = SchemaFactory.createForClass(AuthDocument);

AuthSchema.virtual('password').set(function (password: string) {
  this.hashedPassword = hashSync(password, 12);
});

AuthSchema.methods.validatePassword = function (password: string): boolean {
  return compareSync(password, this.hashedPassword);
};
