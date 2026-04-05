import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from './entities/calendar-event.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  getEvents(
    @CurrentUser() user: User,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.calendarService.findByRange(user.id, new Date(start), new Date(end));
  }

  @Post('events')
  createEvent(@CurrentUser() user: User, @Body() data: Partial<CalendarEvent>) {
    return this.calendarService.create(user.id, data);
  }

  @Patch('events/:id')
  updateEvent(@Param('id') id: string, @Body() data: Partial<CalendarEvent>) {
    return this.calendarService.update(id, data);
  }

  @Delete('events/:id')
  removeEvent(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}
