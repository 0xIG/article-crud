import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../database';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export type SignupDtoResponse = Partial<User>;
