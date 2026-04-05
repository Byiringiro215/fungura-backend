import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './entities/inventory-item.entity';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.findAll({ category, status, search, page, limit });
  }

  @Get('stats')
  getStats() {
    return this.inventoryService.getStats();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  create(@Body() data: Partial<InventoryItem>) {
    return this.inventoryService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<InventoryItem>) {
    return this.inventoryService.update(id, data);
  }

  @Patch(':id/adjust')
  adjustStock(@Param('id') id: string, @Body('adjustment') adjustment: number) {
    return this.inventoryService.adjustStock(id, adjustment);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
