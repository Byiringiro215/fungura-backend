import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'orlando@fungura.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  password: string;
}
