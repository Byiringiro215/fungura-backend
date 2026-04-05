import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder } from './entities/purchase-order.entity';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Get()
  findAll(@Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.poService.findAll({ status, page, limit });
  }

  @Get('stats')
  getStats() { return this.poService.getStats(); }

  @Post()
  create(@Body() data: Partial<PurchaseOrder>) { return this.poService.create(data); }

  @Patch(':id/receive')
  receive(@Param('id') id: string) { return this.poService.receive(id); }
}
