import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private readonly notifRepo: Repository<Notification>) {}

  async findAll(query: { userId?: string; read?: string; type?: string; page?: number; limit?: number }): Promise<PaginatedResult<Notification>> {
    const { userId, read, type, page = 1, limit = 10 } = query;
    const qb = this.notifRepo.createQueryBuilder('n').orderBy('n.createdAt', 'DESC');

    if (userId) qb.andWhere('(n.userId = :userId OR n.userId IS NULL)', { userId });
    if (read === 'unread') qb.andWhere('n.read = false');
    if (type && type !== 'all') qb.andWhere('n.type = :type', { type });

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async markAsRead(id: string): Promise<Notification> {
    const n = await this.notifRepo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notification not found');
    n.read = true;
    return this.notifRepo.save(n);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notifRepo.createQueryBuilder()
      .update(Notification).set({ read: true })
      .where('(userId = :userId OR userId IS NULL) AND read = false', { userId })
      .execute();
  }

  async remove(id: string): Promise<void> {
    await this.notifRepo.delete(id);
  }

  async broadcast(data: { title: string; message: string; type: string }): Promise<Notification> {
    const notif = this.notifRepo.create(data);
    return this.notifRepo.save(notif);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifRepo.createQueryBuilder('n')
      .where('(n.userId = :userId OR n.userId IS NULL) AND n.read = false', { userId })
      .getCount();
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notifRepo.save(this.notifRepo.create(data));
  }
}
