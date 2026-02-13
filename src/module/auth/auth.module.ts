import { Module } from '@nestjs/common';
import { AuthController } from './controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard';
import { UserModule } from '../user';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
