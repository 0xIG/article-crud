import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../database';
import {
  SigninDto,
  SigninDtoResponse,
  SignupDto,
  SignupDtoResponse,
} from '../dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
  ) {}

  public async signin(params: SigninDto): Promise<SigninDtoResponse> {
    const { email, password } = params;
    const user = await this.database.userGetByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await compare(password, user.hashPassword))) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, email };
    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }

  public async signup(data: SignupDto): Promise<SignupDtoResponse> {
    const { email, password, name } = data;
    const existingUser = await this.database.userGetByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashPassword = await hash(password, 10);
    return await this.database.userAdd(email, hashPassword, name);
  }
}
