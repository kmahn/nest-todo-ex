import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FILE_REF_TYPE, FileRefType, File } from '../../../types/file';

type FieldType = Pick<
  File,
  'filename' | 'key' | 'mimetype' | 'size' | 'creator'
> &
  Partial<Pick<File, 'ref' | 'refType'>>;

@Schema({ collection: 'file', timestamps: { createdAt: true, updatedAt: false } })
export class FileDocument extends Document implements FieldType {
  @Prop({ type: String })
  filename: string;

  @Prop({ type: String, unique: true, required: true })
  key: string;

  @Prop({ type: String, required: true })
  mimetype: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  creator: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, index: true })
  ref?: string | null;

  @Prop({
    type: String,
    enum: [...FILE_REF_TYPE, null],
    default: null,
    index: true
  })
  refType?: FileRefType | null;
}

export const FileSchema = SchemaFactory.createForClass(FileDocument);
