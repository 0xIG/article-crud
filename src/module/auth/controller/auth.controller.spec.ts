import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../../user';
import { SigninDto, SignupDto } from '../dto';
import { User } from '../../user';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs module
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    hashPassword: '$2a$10$hashedpassword123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockUserService = {
      userGetByEmail: jest.fn(),
      userAdd: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access token for valid credentials', async () => {
      userService.userGetByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const token = 'jwt.token.here';
      jwtService.signAsync.mockResolvedValue(token);
      configService.getOrThrow.mockReturnValue('jwt-secret');

      const result = await controller.signin(signinDto);
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userService.userGetByEmail.mockResolvedValue(null);

      await expect(controller.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userService.userGetByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(controller.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    };

    const createdUser: Partial<User> = {
      id: 2,
      email: signupDto.email,
      name: signupDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully register a new user', async () => {
      userService.userGetByEmail.mockResolvedValue(null);
      userService.userAdd.mockResolvedValue(createdUser as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await controller.signup(signupDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw BadRequestException when user already exists', async () => {
      userService.userGetByEmail.mockResolvedValue(mockUser);

      await expect(controller.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
