import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class JoinUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^[a-zA-Z\d!@#$%^&*()]+$/)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Matches(/^\d+$/)
  @IsString()
  @IsNotEmpty()
  phone: string;
}
