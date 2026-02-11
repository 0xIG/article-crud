import { Module } from '@nestjs/common';
import { DatabaseService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
