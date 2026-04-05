import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KitchenService } from './kitchen.service';
import { KitchenStatus } from '../orders/entities/order.entity';

@ApiTags('Kitchen')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('orders')
  getActiveOrders(@Query('status') status?: string) {
    return this.kitchenService.getActiveOrders(status);
  }

  @Get('stats')
  getStats() {
    return this.kitchenService.getStats();
  }

  @Get('drivers')
  getAvailableDrivers() {
    return this.kitchenService.getAvailableDrivers();
  }

  @Patch('orders/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: KitchenStatus,
  ) {
    return this.kitchenService.updateKitchenStatus(id, status);
  }

  @Patch('orders/:id/driver')
  assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.kitchenService.assignDriver(id, driverId);
  }
}
