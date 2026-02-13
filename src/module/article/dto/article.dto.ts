import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Article } from '../entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export type ArticleGetDtoResponse = Article;

export class ArticleAddDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export type ArticleAddDtoResponse = Article;

export class ArticleEditDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export type ArticleEditDtoResponse = Article;

export type ArticleDeleteDtoResponse = { articleId: number; success: boolean };

export enum SORT {
  DESC = 'DESC',
  ASC = 'ASC',
}

export type ArticleSort = { [P in keyof Article]: SORT };

export class ArticleListDto {
  @IsOptional()
  @IsNumber()
  pageIndex?: number;

  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  sort?: ArticleSort;
}

export interface ArticleListDtoResponse {
  items: Article[];
  total: number;
}
