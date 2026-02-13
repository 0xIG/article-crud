import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user';
import { ApiProperty } from '@nestjs/swagger';

export type Payload = {
  sub: number;
  email: string;
};

export class SigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface SigninDtoResponse {
  access_token: string;
}

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export type SignupDtoResponse = Partial<User>;
