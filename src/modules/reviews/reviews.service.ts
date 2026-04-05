import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly reviewRepo: Repository<Review>) {}

  async findAll(query: { rating?: number; category?: string; sort?: string; page?: number; limit?: number }): Promise<PaginatedResult<Review>> {
    const { rating, category, sort, page = 1, limit = 6 } = query;
    const qb = this.reviewRepo.createQueryBuilder('r');

    if (rating) qb.andWhere('FLOOR(r.rating) = :rating', { rating });
    if (category && category !== 'all') qb.andWhere('r.category = :category', { category });

    if (sort === 'rating') qb.orderBy('r.rating', 'DESC');
    else if (sort === 'reviews') qb.orderBy('r.reviewCount', 'DESC');
    else qb.orderBy('r.createdAt', 'DESC');

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(data: Partial<Review>): Promise<Review> {
    return this.reviewRepo.save(this.reviewRepo.create(data));
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepo.delete(id);
  }

  async getStats() {
    const totalReviews = await this.reviewRepo.count();
    const avgRating = await this.reviewRepo.createQueryBuilder('r').select('AVG(r.rating)', 'avg').getRawOne();
    const categories = await this.reviewRepo.createQueryBuilder('r')
      .select('r.category', 'category').addSelect('AVG(r.rating)', 'avgRating').addSelect('COUNT(*)', 'count')
      .groupBy('r.category').getRawMany();
    return { totalReviews, averageRating: parseFloat(avgRating?.avg || '0'), categories };
  }
}
