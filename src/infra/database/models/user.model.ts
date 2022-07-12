import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TUserRole, User, USER_ROLES } from '../../../types/user';

@Schema({
  collection: 'user',
  timestamps: { createdAt: 'joinedAt', updatedAt: true },
})
export class UserDocument
  extends Document
  implements Pick<User, 'role' | 'email' | 'name' | 'phone' | 'auth'>
{
  @Prop({ type: String, enum: USER_ROLES, default: 'member' })
  role: TUserRole;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, trim: true, index: true, required: true })
  name: string;

  @Prop({ type: String, trim: true, index: true })
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  auth: string | null;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
