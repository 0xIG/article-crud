import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IPayload } from '../dto';
import { User, UserService } from '../../user';

/**
 * JWT authentication strategy for Passport.js
 * Validates JWT tokens from Authorization header and retrieves user data
 * @extends PassportStrategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy
   * @param configService - Configuration service for accessing environment variables
   * @param userService - User service for retrieving user data from database
   */
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates JWT payload and retrieves corresponding user
   * This method is called automatically by Passport after token verification
   * @param payload - Decoded JWT payload containing user ID in 'sub' field
   * @returns User entity (excluding sensitive fields like password)
   * @throws UnauthorizedException if user not found in database
   */
  async validate(payload: IPayload): Promise<Partial<User>> {
    const user = await this.userService.userGetById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    return user;
  }
}
