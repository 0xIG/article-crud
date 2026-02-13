import { Injectable } from '@nestjs/common';
import { User } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}
  public async userGetById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  public async userGetByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  public async userAdd(
    email: string,
    hashPassword: string,
    name: string,
  ): Promise<User> {
    const newUser = this.repository.create({ email, hashPassword, name });
    await this.repository.insert(newUser);
    return this.repository.findOneOrFail({
      where: { email },
      select: { email: true, name: true, createdAt: true, updatedAt: true },
    });
  }
}
