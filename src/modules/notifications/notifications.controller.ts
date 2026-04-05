import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { User } from '../users/entities/user.entity';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('read') read?: string, @Query('type') type?: string,
    @Query('page') page?: number, @Query('limit') limit?: number,
  ) { return this.notificationsService.findAll({ userId: user.id, read, type, page, limit }); }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: User) { return this.notificationsService.getUnreadCount(user.id); }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) { return this.notificationsService.markAsRead(id); }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: User) { return this.notificationsService.markAllAsRead(user.id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.notificationsService.remove(id); }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  broadcast(@Body() data: { title: string; message: string; type: string }) {
    return this.notificationsService.broadcast(data);
  }
}
