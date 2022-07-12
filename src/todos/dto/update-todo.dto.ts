import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Todo } from '../../types/todo';

export class UpdateTodoDto
  implements Partial<Pick<Todo, 'title' | 'content' | 'attachments' | 'done'>>
{
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  attachments: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
