import { Injectable } from '@nestjs/common';
import { User } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Service for managing user operations
 * Provides user retrieval and creation functionality
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  /**
   * Retrieve a user by their ID
   * @param id - User ID to search for
   * @returns User entity or null if not found
   */
  public async userGetById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  /**
   * Retrieve a user by their email address
   * @param email - Email address to search for
   * @param includePassword - Flag to include user's hashed password to result
   * @returns User entity or null if not found
   */
  public async userGetByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      select: { hashPassword: includePassword },
    });
  }

  /**
   * Create a new user account
   * @param email - User email address
   * @param hashPassword - Hashed password for authentication
   * @param name - User's full name
   * @returns Newly created user (excluding sensitive fields like password)
   */
  public async userAdd(
    email: string,
    hashPassword: string,
    name: string,
  ): Promise<User> {
    const newUser = this.repository.create({ email, hashPassword, name });
    await this.repository.insert(newUser);
    return this.repository.findOneOrFail({
      where: { email },
    });
  }
}
