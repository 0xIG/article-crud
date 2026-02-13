import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AUTH_ROUTE_PREFIX,
  AUTH_SIGNIN_ROUTE_PREFIX,
  AUTH_SIGNUP_ROUTE_PREFIX,
} from '../../../route';
import {
  Payload,
  SigninDto,
  SigninDtoResponse,
  SignupDto,
  SignupDtoResponse,
} from '../dto';
import { compare, hash } from 'bcryptjs';
import { UserService } from '../../user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Authentication controller for user sign-in and sign-up operations
 * Handles user authentication and registration
 */
@ApiTags('auth')
@Controller(AUTH_ROUTE_PREFIX)
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Authenticate user and return JWT token
   * Note: Uses GET method with body (consider changing to POST for production)
   * @param params - User credentials (email and password)
   * @returns JWT access token for authenticated requests
   */
  @Get(AUTH_SIGNIN_ROUTE_PREFIX)
  @ApiOperation({ summary: 'Sign in user and get JWT token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or user not found',
  })
  async signin(@Body() params: SigninDto): Promise<SigninDtoResponse> {
    const { email, password } = params;
    const user = await this.userService.userGetByEmail(email, true);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await compare(password, user.hashPassword))) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: Payload = { sub: user.id, email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      }),
    };
  }

  /**
   * Register a new user account
   * @param params - User registration data (email, password, name)
   * @returns Newly created user (excluding sensitive fields)
   */
  @Post(AUTH_SIGNUP_ROUTE_PREFIX)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async signup(@Body() params: SignupDto): Promise<SignupDtoResponse> {
    const { email, password, name } = params;
    const existingUser = await this.userService.userGetByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashPassword = await hash(password, 10);
    return await this.userService.userAdd(email, hashPassword, name);
  }
}
