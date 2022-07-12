import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Todo } from '../../types/todo';

type RequiredFieldType = Pick<Todo, 'title' | 'content'>;
type OptionalFieldType = Partial<
  Pick<Todo, 'done' | 'attachments' | 'creator'>
>;
type FieldType = RequiredFieldType & OptionalFieldType;

export class CreateTodoDto implements FieldType {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiProperty()
  @IsEmpty()
  creator?: string;
}
