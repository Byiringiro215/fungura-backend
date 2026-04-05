import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderItem, OrderStatus, OrderType } from './entities/order.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async findAll(query: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Order>> {
    const { status, type, search, page = 1, limit = 10 } = query;

    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (status && status !== 'All') {
      qb.andWhere('order.status = :status', { status });
    }
    if (type && type !== 'All') {
      qb.andWhere('order.type = :type', { type });
    }
    if (search) {
      qb.andWhere(
        '(order.orderNumber ILIKE :search OR order.customer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(data: {
    customer: string;
    type: OrderType;
    tableNumber?: string;
    address?: string;
    items: { name: string; qty: number; price: number; image?: string; notes?: string }[];
  }): Promise<Order> {
    const orderNumber = `ORD${Date.now().toString().slice(-6)}`;
    const totalQty = data.items.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = data.items.reduce((sum, i) => sum + i.qty * i.price, 0);

    const order = this.orderRepo.create({
      orderNumber,
      customer: data.customer,
      type: data.type,
      tableNumber: data.tableNumber,
      address: data.address || '-',
      totalQty,
      totalAmount,
      items: data.items.map((item) =>
        this.orderItemRepo.create(item),
      ),
    });

    return this.orderRepo.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(id);
    order.status = status;
    return this.orderRepo.save(order);
  }

  async assignDriver(id: string, driverId: string, driverName: string): Promise<Order> {
    const order = await this.findById(id);
    order.driverId = driverId;
    order.driverName = driverName;
    return this.orderRepo.save(order);
  }

  async getStats() {
    const total = await this.orderRepo.count();
    const onProcess = await this.orderRepo.count({ where: { status: OrderStatus.ON_PROCESS } });
    const completed = await this.orderRepo.count({ where: { status: OrderStatus.COMPLETED } });
    const cancelled = await this.orderRepo.count({ where: { status: OrderStatus.CANCELLED } });

    return { total, onProcess, completed, cancelled };
  }

  async getRevenueByPeriod(period: 'week' | 'month' | 'year') {
    const now = new Date();
    let startDate: Date;

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const orders = await this.orderRepo.find({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: Between(startDate, now),
      },
      select: ['totalAmount', 'createdAt'],
    });

    return orders;
  }

  async getOrderTypes() {
    const dineIn = await this.orderRepo.count({ where: { type: OrderType.DINE_IN } });
    const takeaway = await this.orderRepo.count({ where: { type: OrderType.TAKEAWAY } });
    const delivery = await this.orderRepo.count({ where: { type: OrderType.DELIVERY } });

    return { dineIn, takeaway, delivery };
  }

  async getRecent(limit = 5): Promise<Order[]> {
    return this.orderRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['items'],
    });
  }
}
