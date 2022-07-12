import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { File } from '../../../types/file';
import { Todo } from '../../../types/todo';

type FieldType = Pick<Todo, 'title' | 'content'> &
  Partial<Pick<Todo, 'done' | 'attachments' | 'creator'>>;

@Schema({ collection: 'todo', timestamps: true })
export class TodoDocument extends Document implements FieldType {
  @Prop({ type: String, index: true, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  done?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  creator?: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  attachments?: Array<File | string>;
}

export const TodoSchema = SchemaFactory.createForClass(TodoDocument);
