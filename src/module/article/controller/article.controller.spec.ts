import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ArticleController } from './article.controller';
import { ArticleService } from '../service';
import { User, UserService } from '../../user';
import {
  ArticleAddDto,
  ArticleEditDto,
  ArticleListDto,
  ArticleSort,
  SORT,
} from '../dto';
import { Article } from '../entity';

describe('ArticleController', () => {
  let controller: ArticleController;
  let articleService: jest.Mocked<ArticleService>;
  let userService: jest.Mocked<UserService>;
  let cacheManager: { del: jest.Mock };

  const mockUser: User = {
    id: 1,
    email: 'author@example.com',
    name: 'Test Author',
    hashPassword: 'hashed_password',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockArticle: Article = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    content: 'Test Content',
    author: mockUser,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockArticleService = {
      articleGetById: jest.fn(),
      articleGetByTitle: jest.fn(),
      articleAdd: jest.fn(),
      articleEdit: jest.fn(),
      articleDelete: jest.fn(),
      articleList: jest.fn(),
    };

    const mockUserService = {
      userGetById: jest.fn(),
    };

    const mockCacheManager = {
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
        { provide: UserService, useValue: mockUserService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    articleService = module.get(ArticleService);
    userService = module.get(UserService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('articleGet', () => {
    it('should return an article when found', async () => {
      (articleService.articleGetById as jest.Mock).mockResolvedValue(
        mockArticle,
      );
      const result = await controller.articleGet(1);
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article not found', async () => {
      (articleService.articleGetById as jest.Mock).mockResolvedValue(null);
      await expect(controller.articleGet(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('articleAdd', () => {
    const addDto: ArticleAddDto = {
      title: 'New Article',
      description: 'New Description',
      content: 'New Content',
    };

    it('should create a new article successfully', async () => {
      userService.userGetById.mockResolvedValue(mockUser);
      articleService.articleGetByTitle.mockResolvedValue(null);
      articleService.articleAdd.mockResolvedValue(mockArticle);

      const result = await controller.articleAdd(addDto, 1);
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when author not found', async () => {
      userService.userGetById.mockResolvedValue(null);
      await expect(controller.articleAdd(addDto, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when article title already exists', async () => {
      userService.userGetById.mockResolvedValue(mockUser);
      articleService.articleGetByTitle.mockResolvedValue(mockArticle);
      await expect(controller.articleAdd(addDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('articleEdit', () => {
    const editDto: ArticleEditDto = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    it('should update an article successfully', async () => {
      articleService.articleGetById.mockResolvedValue(mockArticle);
      articleService.articleEdit.mockResolvedValue({
        ...mockArticle,
        ...editDto,
      });

      const result = await controller.articleEdit(1, editDto, 1);
      expect(result).toEqual({ ...mockArticle, ...editDto });
      expect(cacheManager.del).toHaveBeenCalledWith('/article/:1');
    });

    it('should throw NotFoundException when article not found', async () => {
      articleService.articleGetById.mockResolvedValue(null);
      await expect(controller.articleEdit(1, editDto, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when user is not the author', async () => {
      articleService.articleGetById.mockResolvedValue(mockArticle);
      await expect(controller.articleEdit(1, editDto, 999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('articleDelete', () => {
    it('should delete an article successfully', async () => {
      articleService.articleGetById.mockResolvedValue(mockArticle);
      articleService.articleDelete.mockResolvedValue();

      const result = await controller.articleDelete(1, 1);
      expect(result).toEqual({ articleId: 1, success: true });
      expect(cacheManager.del).toHaveBeenCalledWith('/article/:1');
    });

    it('should throw NotFoundException when article not found', async () => {
      articleService.articleGetById.mockResolvedValue(null);
      await expect(controller.articleDelete(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      articleService.articleGetById.mockResolvedValue(mockArticle);
      await expect(controller.articleDelete(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('articleList', () => {
    const listDto: ArticleListDto = {
      pageIndex: 1,
      pageSize: 10,
    };

    it('should return paginated articles', async () => {
      const articles = [mockArticle];
      const total = 1;
      articleService.articleList.mockResolvedValue({ items: articles, total });

      const result = await controller.articleList(listDto);
      expect(result).toEqual({ items: articles, total });
    });

    it('should use default pagination values', async () => {
      const articles = [mockArticle];
      const total = 1;
      articleService.articleList.mockResolvedValue({ items: articles, total });

      const result = await controller.articleList({});
      expect(result).toEqual({ items: articles, total });
    });

    it('should pass sorting parameters', async () => {
      const articles = [mockArticle];
      const total = 1;
      const sort: ArticleSort = { createdAt: SORT.DESC };
      articleService.articleList.mockResolvedValue({ items: articles, total });

      const result = await controller.articleList({ ...listDto, sort });
      expect(result).toEqual({ items: articles, total });
    });
  });
});
