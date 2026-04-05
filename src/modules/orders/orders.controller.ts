import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { OrderStatus, OrderType } from './entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findAll({ status, type, search, page, limit });
  }

  @Get('stats')
  getStats() {
    return this.ordersService.getStats();
  }

  @Get('types')
  getOrderTypes() {
    return this.ordersService.getOrderTypes();
  }

  @Get('overview')
  getRevenue(@Query('period') period: 'week' | 'month' | 'year' = 'month') {
    return this.ordersService.getRevenueByPeriod(period);
  }

  @Get('recent')
  getRecent(@Query('limit') limit?: number) {
    return this.ordersService.getRecent(limit);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() data: {
    customer: string;
    type: OrderType;
    tableNumber?: string;
    address?: string;
    items: { name: string; qty: number; price: number; image?: string; notes?: string }[];
  }) {
    return this.ordersService.create(data);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/assign-driver')
  assignDriver(
    @Param('id') id: string,
    @Body() body: { driverId: string; driverName: string },
  ) {
    return this.ordersService.assignDriver(id, body.driverId, body.driverName);
  }
}
