import { Module } from '@nestjs/common';
import { SigninController, SignupController } from './controller';
import { AuthService } from './service';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [SigninController, SignupController],
  providers: [AuthService],
})
export class AuthModule {}
