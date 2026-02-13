import { Injectable } from '@nestjs/common';
import { ArticleEditDto, ArticleSort } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entity';
import { User } from '../../user';

/**
 * Service for managing article operations
 * Provides CRUD functionality and business logic for articles
 */
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private repository: Repository<Article>,
  ) {}

  /**
   * Retrieve an article by its ID
   * @param id - Article ID to search for
   * @returns Article with author relation or null if not found
   */
  public async articleGetById(id: number): Promise<Article | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  /**
   * Retrieve an article by its title
   * @param title - Article title to search for
   * @returns Article or null if not found
   */
  public async articleGetByTitle(title: string): Promise<Article | null> {
    return this.repository.findOne({ where: { title } });
  }

  /**
   * Create a new article
   * @param author - User entity of the article author
   * @param title - Article title
   * @param description - Article description/summary
   * @param content - Article content
   * @returns Newly created article
   */
  public async articleAdd(
    author: User,
    title: string,
    description: string,
    content: string,
  ): Promise<Article> {
    const newArticle: Article = this.repository.create({
      author,
      title,
      description,
      content,
    });
    return this.repository.save(newArticle);
  }

  /**
   * Update an existing article
   * @param articleId - ID of the article to update
   * @param params - Partial article data to update
   * @returns Updated article entity
   */
  public async articleEdit(
    articleId: number,
    params: ArticleEditDto,
  ): Promise<Article> {
    await this.repository.update(articleId, params);
    return this.repository.findOneOrFail({ where: { id: articleId } });
  }

  /**
   * Delete an article by ID
   * @param articleId - ID of the article to delete
   */
  public async articleDelete(articleId: number): Promise<void> {
    await this.repository.delete(articleId);
  }

  /**
   * Retrieve paginated list of articles with optional sorting
   * @param pageSize - Number of items per page
   * @param pageIndex - Page number (1-indexed)
   * @param sort - Optional sorting criteria
   * @returns Object containing articles array and total count
   */
  public async articleList(
    pageSize: number,
    pageIndex: number,
    sort: ArticleSort | undefined,
  ): Promise<{ items: Article[]; total: number }> {
    const skip = (pageIndex - 1) * pageSize;
    const [items, total] = await this.repository.findAndCount({
      relations: ['author'],
      skip,
      take: pageSize,
      order: sort || {},
    });
    return { items, total };
  }
}
