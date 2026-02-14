import { Module } from '@nestjs/common';
import { ArticleService } from './service';
import { ArticleController } from './controller';
import { Article } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class ArticleModule {}
