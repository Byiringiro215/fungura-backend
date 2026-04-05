import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuRepo: Repository<MenuItem>,
  ) {}

  async findAll(query: {
    category?: string;
    mealTime?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<MenuItem>> {
    const { category, mealTime, search, sort, page = 1, limit = 10 } = query;

    const qb = this.menuRepo.createQueryBuilder('item');

    if (category && category !== 'All') {
      qb.andWhere('item.category = :category', { category });
    }
    if (mealTime && mealTime !== 'All') {
      qb.andWhere('item.mealTime = :mealTime', { mealTime });
    }
    if (search) {
      qb.andWhere('(item.name ILIKE :search OR item.category ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Sorting
    if (sort === 'price-asc') qb.orderBy('item.price', 'ASC');
    else if (sort === 'price-desc') qb.orderBy('item.price', 'DESC');
    else if (sort === 'name') qb.orderBy('item.name', 'ASC');
    else if (sort === 'rating') qb.orderBy('item.rating', 'DESC');
    else qb.orderBy('item.createdAt', 'DESC');

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string): Promise<MenuItem> {
    const item = await this.menuRepo.findOne({ where: { slug } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async findById(id: string): Promise<MenuItem> {
    const item = await this.menuRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(data: Partial<MenuItem>): Promise<MenuItem> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const item = this.menuRepo.create(data);
    return this.menuRepo.save(item);
  }

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    await this.findById(id);
    await this.menuRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.menuRepo.delete(id);
  }

  async getCategories(): Promise<string[]> {
    const result = await this.menuRepo
      .createQueryBuilder('item')
      .select('DISTINCT item.category', 'category')
      .orderBy('item.category', 'ASC')
      .getRawMany();
    return result.map((r) => r.category);
  }

  async getTrending(limit = 5): Promise<MenuItem[]> {
    return this.menuRepo.find({
      order: { orderCount: 'DESC', rating: 'DESC' },
      take: limit,
    });
  }
}
