import { Module } from '@nestjs/common';
import { ArticleService } from './service';
import { ArticleController } from './controller';
import { Article } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
