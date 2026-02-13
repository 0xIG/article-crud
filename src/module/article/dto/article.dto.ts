import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Article } from '../entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response DTO for getting a single article
 */
export type ArticleGetDtoResponse = Article;

/**
 * DTO for creating a new article
 */
export class ArticleAddDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the article',
    example: 'Introduction to NestJS',
    maxLength: 255,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Short description/summary of the article',
    example: 'A comprehensive guide to building REST APIs with NestJS',
    maxLength: 1000,
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full content of the article in markdown or plain text',
    example: '# Introduction\nNestJS is a progressive Node.js framework...',
  })
  content: string;
}

/**
 * Response DTO after creating a new article
 */
export type ArticleAddDtoResponse = Article;

/**
 * DTO for updating an existing article
 */
export class ArticleEditDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Updated title of the article',
    example: 'Advanced NestJS Patterns',
    maxLength: 255,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Updated description/summary of the article',
    example: 'Learn advanced patterns and best practices in NestJS',
    maxLength: 1000,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Updated content of the article',
    example: '# Advanced Patterns\nDependency injection and modular design...',
  })
  content?: string;
}

/**
 * Response DTO after updating an article
 */
export type ArticleEditDtoResponse = Article;

/**
 * Response DTO after deleting an article
 */
export type ArticleDeleteDtoResponse = { articleId: number; success: boolean };

/**
 * Sorting direction enum
 */
export enum SORT {
  DESC = 'DESC',
  ASC = 'ASC',
}

/**
 * Type for sorting articles by any field with direction
 */
export type ArticleSort = { [P in keyof Article]: SORT };

/**
 * DTO for listing articles with pagination and sorting
 */
export class ArticleListDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  pageIndex?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  pageSize?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Sorting criteria for articles',
    example: { createdAt: 'DESC' },
    type: 'object',
    additionalProperties: {
      type: 'string',
      enum: ['ASC', 'DESC'],
    },
  })
  sort?: ArticleSort;
}

/**
 * Response DTO for listing articles with pagination
 */
export interface ArticleListDtoResponse {
  /** Array of articles */
  items: Article[];
  /** Total number of articles available */
  total: number;
}
