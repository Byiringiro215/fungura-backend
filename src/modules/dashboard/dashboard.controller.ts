import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() { return this.dashboardService.getStats(); }

  @Get('revenue')
  getRevenue(@Query('period') period: 'week' | 'month' | 'year' = 'month') {
    return this.dashboardService.getRevenue(period);
  }

  @Get('order-types')
  getOrderTypes() { return this.dashboardService.getOrderTypes(); }

  @Get('recent-orders')
  getRecentOrders(@Query('limit') limit?: number) { return this.dashboardService.getRecentOrders(limit); }

  @Get('trending-menus')
  getTrendingMenus(@Query('limit') limit?: number) { return this.dashboardService.getTrendingMenus(limit); }

  @Get('categories')
  getCategories() { return this.dashboardService.getCategories(); }
}
