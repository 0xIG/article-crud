import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(dataSourceOptions)],
  controllers: [],
  providers: [],
})
export class AppModule {}
