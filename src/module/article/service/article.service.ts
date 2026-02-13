import { Injectable } from '@nestjs/common';
import { ArticleEditDto, ArticleSort } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entity';
import { User } from '../../user';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private repository: Repository<Article>,
  ) {}

  public async articleGetById(id: number): Promise<Article | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  public async articleGetByTitle(title: string): Promise<Article | null> {
    return this.repository.findOne({ where: { title } });
  }

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

  public async articleEdit(
    articleId: number,
    params: ArticleEditDto,
  ): Promise<Article> {
    await this.repository.update(articleId, params);
    return this.repository.findOneOrFail({ where: { id: articleId } });
  }

  public async articleDelete(articleId: number): Promise<void> {
    await this.repository.delete(articleId);
  }

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
