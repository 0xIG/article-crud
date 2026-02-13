import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ARTICLE_LIST_ROUTE_PREFIX,
  ARTICLE_ROUTE_PREFIX,
} from '../../../route';
import { ArticleService } from '../service';
import {
  ArticleAddDto,
  ArticleAddDtoResponse,
  ArticleDeleteDtoResponse,
  ArticleEditDto,
  ArticleEditDtoResponse,
  ArticleGetDtoResponse,
  ArticleListDto,
  ArticleListDtoResponse,
} from '../dto';
import { JwtAuthGuard, UserIdGet } from '../../auth';
import { UserService } from '../../user';

/**
 * Controller for managing articles
 * Provides REST API endpoints for article CRUD operations
 */
@ApiTags('articles')
@Controller(ARTICLE_ROUTE_PREFIX)
export class ArticleController {
  constructor(
    private userService: UserService,
    private articleService: ArticleService,
  ) {}

  /**
   * Retrieve a single article by ID
   * @param articleId - ID of the article to retrieve
   * @returns Article entity with author details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async articleGet(
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<ArticleGetDtoResponse> {
    const article = await this.articleService.articleGetById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  /**
   * Create a new article
   * Requires JWT authentication - only authenticated users can create articles
   * @param params - Article creation data (title, description, content)
   * @param authorId - ID of the authenticated user (extracted from JWT token)
   * @returns Newly created article
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Article with given title already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async articleAdd(
    @Body() params: ArticleAddDto,
    @UserIdGet() authorId: number,
  ): Promise<ArticleAddDtoResponse> {
    const author = await this.userService.userGetById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    const { title, description, content } = params;
    const existingArticle = await this.articleService.articleGetByTitle(title);
    if (existingArticle) {
      throw new BadRequestException('Article with given title already exists');
    }
    return await this.articleService.articleAdd(
      author,
      title,
      description,
      content,
    );
  }

  /**
   * Update an existing article
   * Requires JWT authentication - only the article author can edit
   * @param articleId - ID of the article to update
   * @param params - Partial article data to update
   * @param authorId - ID of the authenticated user (extracted from JWT token)
   * @returns Updated article
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 400, description: 'Only author can edit article' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async articleEdit(
    @Param('id', ParseIntPipe) articleId: number,
    @Body() params: ArticleEditDto,
    @UserIdGet() authorId: number,
  ): Promise<ArticleEditDtoResponse> {
    const article = await this.articleService.articleGetById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (article.author.id !== authorId) {
      throw new BadRequestException('Only author can edit article');
    }
    return await this.articleService.articleEdit(articleId, params);
  }

  /**
   * Delete an article
   * Requires JWT authentication - only the article author can delete
   * @param articleId - ID of the article to delete
   * @param authorId - ID of the authenticated user (extracted from JWT token)
   * @returns Success response with article ID
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only author can delete article',
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async articleDelete(
    @Param('id', ParseIntPipe) articleId: number,
    @UserIdGet() authorId: number,
  ): Promise<ArticleDeleteDtoResponse> {
    const article = await this.articleService.articleGetById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (article.author.id !== authorId) {
      throw new ForbiddenException('Only author can delete article');
    }
    await this.articleService.articleDelete(articleId);
    return { articleId: articleId, success: true };
  }

  /**
   * List articles with pagination and sorting
   * Public endpoint - no authentication required
   * @param params - Pagination and sorting parameters
   * @returns Paginated list of articles with total count
   */
  @Get(ARTICLE_LIST_ROUTE_PREFIX)
  @ApiOperation({ summary: 'List articles with pagination' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async articleList(
    @Query() params: ArticleListDto,
  ): Promise<ArticleListDtoResponse> {
    const { pageIndex, pageSize, sort } = params;
    const { items, total } = await this.articleService.articleList(
      pageSize || 10,
      pageIndex || 1,
      sort,
    );
    return {
      items,
      total,
    };
  }
}
