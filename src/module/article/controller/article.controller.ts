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

@Controller(ARTICLE_ROUTE_PREFIX)
export class ArticleController {
  constructor(
    private userService: UserService,
    private articleService: ArticleService,
  ) {}

  @Get(':id')
  async articleGet(
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<ArticleGetDtoResponse> {
    const article = await this.articleService.articleGetById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
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

  @Get(ARTICLE_LIST_ROUTE_PREFIX)
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
