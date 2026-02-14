import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JWT payload structure used for authentication tokens
 */
export interface IPayload {
  /** Subject (user ID) */
  sub: number;
}

/**
 * DTO for user sign-in/authentication
 */
export class SigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
  })
  password: string;
}

/**
 * Response DTO for successful sign-in
 */
export interface SigninDtoResponse {
  /** JWT access token for authenticated requests */
  access_token: string;
}

/**
 * DTO for user registration/sign-up
 */
export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'newuser@example.com',
    format: 'email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securePassword123',
    minLength: 6,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 100,
  })
  name: string;
}

/**
 * Response DTO for successful sign-up
 */
export type SignupDtoResponse = Partial<User>;
