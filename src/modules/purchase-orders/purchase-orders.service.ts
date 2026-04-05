import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
  ) {}

  async findAll(query: { status?: string; page?: number; limit?: number }): Promise<PaginatedResult<PurchaseOrder>> {
    const { status, page = 1, limit = 10 } = query;
    const qb = this.poRepo.createQueryBuilder('po').orderBy('po.createdAt', 'DESC');

    if (status && status !== 'All') {
      qb.andWhere('po.status = :status', { status });
    }

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const orderNumber = `PO${Date.now().toString().slice(-6)}`;
    const po = this.poRepo.create({ ...data, orderNumber, total: (data.unitPrice || 0) * (data.qty || 0) });
    return this.poRepo.save(po);
  }

  async receive(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException('Purchase order not found');
    po.status = 'Received';
    po.deliveryProgress = 100;
    return this.poRepo.save(po);
  }

  async getStats() {
    const total = await this.poRepo.count();
    const pending = await this.poRepo.count({ where: { status: 'Pending' } });
    const inTransit = await this.poRepo.count({ where: { status: 'In Transit' } });
    const received = await this.poRepo.count({ where: { status: 'Received' } });
    return { total, pending, inTransit, received };
  }
}
