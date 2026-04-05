import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  async findAll(query: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<InventoryItem>> {
    const { category, status, search, page = 1, limit = 10 } = query;
    const qb = this.inventoryRepo.createQueryBuilder('item');

    if (category && category !== 'All') {
      qb.andWhere('item.category = :category', { category });
    }
    if (status && status !== 'All') {
      qb.andWhere('item.status = :status', { status });
    }
    if (search) {
      qb.andWhere('item.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('item.createdAt', 'DESC');

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.inventoryRepo.create(data);
    item.status = this.computeStatus(item.stock, item.reorderPoint);
    return this.inventoryRepo.save(item);
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = await this.findById(id);
    Object.assign(item, data);
    item.status = this.computeStatus(item.stock, item.reorderPoint);
    return this.inventoryRepo.save(item);
  }

  async adjustStock(id: string, adjustment: number): Promise<InventoryItem> {
    const item = await this.findById(id);
    item.stock = Math.max(0, item.stock + adjustment);
    item.status = this.computeStatus(item.stock, item.reorderPoint);
    return this.inventoryRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.inventoryRepo.delete(id);
  }

  async getStats() {
    const total = await this.inventoryRepo.count();
    const lowStock = await this.inventoryRepo
      .createQueryBuilder('item')
      .where('item.stock <= item.reorderPoint AND item.stock > 0')
      .getCount();
    const outOfStock = await this.inventoryRepo.count({ where: { stock: 0 } });
    const available = total - lowStock - outOfStock;

    return { total, available, lowStock, outOfStock };
  }

  private computeStatus(stock: number, reorderPoint: number): string {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= reorderPoint) return 'Low Stock';
    return 'Available';
  }
}
