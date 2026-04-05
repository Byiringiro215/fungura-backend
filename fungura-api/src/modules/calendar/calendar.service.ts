import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';

@Injectable()
export class CalendarService {
  constructor(@InjectRepository(CalendarEvent) private readonly eventRepo: Repository<CalendarEvent>) {}

  async findByRange(userId: string, start: Date, end: Date): Promise<CalendarEvent[]> {
    return this.eventRepo.find({
      where: { userId, startDate: Between(start, end) },
      order: { startDate: 'ASC' },
    });
  }

  async create(userId: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.eventRepo.save(this.eventRepo.create({ ...data, userId }));
  }

  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    Object.assign(event, data);
    return this.eventRepo.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventRepo.delete(id);
  }
}
