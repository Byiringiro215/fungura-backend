import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data as any);
    return this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userRepo.update(id, { refreshToken: refreshToken as any });
  }

  async updateSettings(id: string, settings: Record<string, unknown>): Promise<User> {
    const user = await this.findById(id);
    user.settings = { ...(user.settings || {}), ...settings };
    return this.userRepo.save(user);
  }
}
