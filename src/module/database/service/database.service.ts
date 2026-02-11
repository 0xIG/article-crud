import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}

  public async userGetById(id: number): Promise<User | null> {
    return await this.user.findOneBy({ id });
  }

  public async userGetByEmail(email: string): Promise<User | null> {
    return await this.user.findOneBy({ email});
  }

  public async userAdd(
    email: string,
    hashPassword: string,
    name: string,
  ): Promise<User> {
    const newUser = this.user.create({ email, hashPassword, name });
    // TODO: user.save keeps returning hashPassword with select: false
    // return await this.user.save(newUser);
    await this.user.insert(newUser);
    return this.user.findOneOrFail({
      select: { email: true, name: true, createdAt: true, updatedAt: true },
    });
  }
}
