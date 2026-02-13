import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
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

@Controller(AUTH_ROUTE_PREFIX)
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get(AUTH_SIGNIN_ROUTE_PREFIX)
  async signin(@Body() params: SigninDto): Promise<SigninDtoResponse> {
    const { email, password } = params;
    const user = await this.userService.userGetByEmail(email);
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

  @Post(AUTH_SIGNUP_ROUTE_PREFIX)
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
