import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Order, KitchenStatus } from '../orders/entities/order.entity';
import { Worker, WorkerRole } from '../workers/entities/worker.entity';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Worker) private readonly workerRepo: Repository<Worker>,
  ) {}

  async getActiveOrders(status?: string) {
    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.kitchenStatus != :completed', { completed: KitchenStatus.COMPLETED })
      .orderBy('order.createdAt', 'ASC');

    if (status && status !== 'all') {
      qb.andWhere('order.kitchenStatus = :status', { status });
    }

    return qb.getMany();
  }

  async updateKitchenStatus(orderId: string, status: KitchenStatus): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');
    order.kitchenStatus = status;
    return this.orderRepo.save(order);
  }

  async assignDriver(orderId: string, driverId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const driver = await this.workerRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    order.driverId = driver.id;
    order.driverName = driver.name;
    return this.orderRepo.save(order);
  }

  async getStats() {
    const pending = await this.orderRepo.count({ where: { kitchenStatus: KitchenStatus.PENDING } });
    const preparing = await this.orderRepo.count({ where: { kitchenStatus: KitchenStatus.PREPARING } });
    const ready = await this.orderRepo.count({ where: { kitchenStatus: KitchenStatus.READY } });
    const urgent = await this.orderRepo.count({
      where: { kitchenStatus: Not(KitchenStatus.COMPLETED), priority: 'urgent' },
    });

    return { pending, preparing, ready, urgent };
  }

  async getAvailableDrivers() {
    return this.workerRepo.find({
      where: { role: WorkerRole.DELIVERY, status: Not('Offline' as any) },
    });
  }
}
