import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ArticleService } from './article.service';
import { Article } from '../entity';
import { User } from '../../user';
import { ArticleEditDto, ArticleSort, SORT } from '../dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let repository: jest.Mocked<Repository<Article>>;

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
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repository = module.get(getRepositoryToken(Article));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('articleGetById', () => {
    it('should return an article when found by ID', async () => {
      repository.findOne.mockResolvedValue(mockArticle);
      const result = await service.articleGetById(1);
      expect(result).toEqual(mockArticle);
    });

    it('should return null when article not found by ID', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.articleGetById(999);
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      repository.findOne.mockRejectedValue(error);
      await expect(service.articleGetById(1)).rejects.toThrow(error);
    });
  });

  describe('articleGetByTitle', () => {
    it('should return an article when found by title', async () => {
      repository.findOne.mockResolvedValue(mockArticle);
      const result = await service.articleGetByTitle('Test Article');
      expect(result).toEqual(mockArticle);
    });

    it('should return null when article not found by title', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.articleGetByTitle('Non-existent Article');
      expect(result).toBeNull();
    });
  });

  describe('articleAdd', () => {
    it('should successfully create a new article', async () => {
      const newArticleData = {
        author: mockUser,
        title: 'New Article',
        description: 'New Description',
        content: 'New Content',
      };

      const createdArticle: Article = {
        id: 2,
        ...newArticleData,
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };

      repository.create.mockReturnValue(createdArticle);
      repository.save.mockResolvedValue(createdArticle);

      const result = await service.articleAdd(
        newArticleData.author,
        newArticleData.title,
        newArticleData.description,
        newArticleData.content,
      );
      expect(result).toEqual(createdArticle);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      repository.create.mockImplementation(() => {
        throw error;
      });

      await expect(
        service.articleAdd(mockUser, 'Title', 'Description', 'Content'),
      ).rejects.toThrow(error);
    });
  });

  describe('articleEdit', () => {
    it('should successfully update an article', async () => {
      const updateParams: ArticleEditDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        content: 'Updated Content',
      };

      const updatedArticle: Article = {
        ...mockArticle,
        ...updateParams,
        updatedAt: new Date('2024-01-03T00:00:00.000Z'),
      };

      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      repository.update.mockResolvedValue(mockUpdateResult);
      repository.findOneOrFail.mockResolvedValue(updatedArticle);

      const result = await service.articleEdit(1, updateParams);
      expect(result).toEqual(updatedArticle);
    });

    it('should handle update errors', async () => {
      const updateParams: ArticleEditDto = { title: 'Updated Title' };
      const error = new Error('Update failed');
      repository.update.mockRejectedValue(error);

      await expect(service.articleEdit(1, updateParams)).rejects.toThrow(error);
    });
  });

  describe('articleDelete', () => {
    it('should successfully delete an article', async () => {
      const mockDeleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };
      repository.delete.mockResolvedValue(mockDeleteResult);
      await service.articleDelete(1);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Deletion failed');
      repository.delete.mockRejectedValue(error);
      await expect(service.articleDelete(1)).rejects.toThrow(error);
    });
  });

  describe('articleList', () => {
    it('should return paginated articles without sorting', async () => {
      const articles = [mockArticle];
      const total = 1;

      repository.findAndCount.mockResolvedValue([articles, total]);

      const result = await service.articleList(10, 1, undefined);
      expect(result).toEqual({ items: articles, total });
      expect(result.items).toHaveLength(1);
    });

    it('should return paginated articles with sorting', async () => {
      const articles = [mockArticle];
      const total = 1;
      const sort: ArticleSort = { createdAt: SORT.DESC };

      repository.findAndCount.mockResolvedValue([articles, total]);

      const result = await service.articleList(10, 1, sort);
      expect(result).toEqual({ items: articles, total });
    });

    it('should handle pagination correctly', async () => {
      const articles = [mockArticle];
      const total = 1;

      repository.findAndCount.mockResolvedValue([articles, total]);

      const result = await service.articleList(5, 2, undefined);
      expect(result).toEqual({ items: articles, total });
    });

    it('should handle list errors', async () => {
      const error = new Error('List failed');
      repository.findAndCount.mockRejectedValue(error);
      await expect(service.articleList(10, 1, undefined)).rejects.toThrow(
        error,
      );
    });
  });
});
