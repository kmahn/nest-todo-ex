import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsOptional } from 'class-validator';

function stringToRegExp(value: string): RegExp {
  const s = '.*+?^$[]{}()|\\';
  return new RegExp(
    value
      .split('')
      .map((c) => (s.includes(c) ? '\\' + c : c))
      .join(''),
    'i',
  );
}

export class QueryTodoDto {
  @ApiProperty({
    description: '제목으로 검색',
  })
  @Transform((params) => ({ $regex: stringToRegExp(params.value) }))
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  done?: boolean;

  @ApiProperty()
  @IsOptional()
  user?: string;
}
