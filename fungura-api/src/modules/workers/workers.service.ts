import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Worker, WorkerRole } from './entities/worker.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker) private readonly workerRepo: Repository<Worker>,
  ) {}

  async findAll(query: { role?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedResult<Worker>> {
    const { role, search, page = 1, limit = 20 } = query;
    const qb = this.workerRepo.createQueryBuilder('w').orderBy('w.joinedDate', 'DESC');

    if (role && role !== 'All') qb.andWhere('w.role = :role', { role });
    if (search) qb.andWhere('(w.name ILIKE :search OR w.id::text ILIKE :search)', { search: `%${search}%` });

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string): Promise<Worker> {
    const w = await this.workerRepo.findOne({ where: { id } });
    if (!w) throw new NotFoundException('Worker not found');
    return w;
  }

  async create(data: Partial<Worker>): Promise<Worker> {
    return this.workerRepo.save(this.workerRepo.create(data));
  }

  async update(id: string, data: Partial<Worker>): Promise<Worker> {
    await this.findById(id);
    await this.workerRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.workerRepo.delete(id);
  }

  async getStats() {
    const total = await this.workerRepo.count();
    const onDuty = await this.workerRepo.count({ where: { status: Not('Offline' as any) } });
    const roles = await this.workerRepo.createQueryBuilder('w')
      .select('w.role', 'role').addSelect('COUNT(*)', 'count')
      .groupBy('w.role').getRawMany();
    return { total, onDuty, roles };
  }

  async getDrivers(): Promise<Worker[]> {
    return this.workerRepo.find({ where: { role: WorkerRole.DELIVERY } });
  }
}
