import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'refreshtoken' })
export class RefreshTokenDocument extends Document {
  @Prop({ type: String, unique: true, required: true })
  value: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: string;

  @Prop({ type: Date, expires: '30d', default: Date.now })
  createdAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenDocument);
