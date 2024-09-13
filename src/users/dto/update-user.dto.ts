import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Jack' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Jack' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'test1@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
