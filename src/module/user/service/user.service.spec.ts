import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '../entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    hashPassword: 'hashed_password_123',
    name: 'Test User',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      insert: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('userGetById', () => {
    it('should return a user when found by ID', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.userGetById(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by ID', async () => {
      repository.findOneBy.mockResolvedValue(null);
      const result = await service.userGetById(999);
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const error = new Error('Database connection failed');
      repository.findOneBy.mockRejectedValue(error);
      await expect(service.userGetById(1)).rejects.toThrow(error);
    });
  });

  describe('userGetByEmail', () => {
    it('should return a user when found by email', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const result = await service.userGetByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return a user with password when includePassword is true', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const result = await service.userGetByEmail('test@example.com', true);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.userGetByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should handle database errors when searching by email', async () => {
      const error = new Error('Database query failed');
      repository.findOne.mockRejectedValue(error);
      await expect(service.userGetByEmail('test@example.com')).rejects.toThrow(
        error,
      );
    });
  });

  describe('userAdd', () => {
    it('should successfully create a new user', async () => {
      const newUserData = {
        email: 'newuser@example.com',
        hashPassword: 'hashed_password_123',
        name: 'New User',
      };

      const createdUser: User = {
        id: 2,
        ...newUserData,
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };

      repository.create.mockReturnValue(createdUser);
      repository.findOneOrFail.mockResolvedValue(createdUser);

      const result = await service.userAdd(
        newUserData.email,
        newUserData.hashPassword,
        newUserData.name,
      );
      expect(result).toEqual(createdUser);
    });

    it('should handle insertion errors', async () => {
      const newUserData = {
        email: 'newuser@example.com',
        hashPassword: 'hashed_password_123',
        name: 'New User',
      };

      const createdUser: User = {
        id: 2,
        ...newUserData,
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };

      const error = new Error('Insert failed: duplicate email');
      repository.create.mockReturnValue(createdUser);
      repository.insert.mockRejectedValue(error);

      await expect(
        service.userAdd(
          newUserData.email,
          newUserData.hashPassword,
          newUserData.name,
        ),
      ).rejects.toThrow(error);
    });
  });
});
