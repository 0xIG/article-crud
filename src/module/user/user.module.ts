import { Module } from '@nestjs/common';
import { UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
