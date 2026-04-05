import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly menuService: MenuService,
  ) {}

  async getStats() {
    const orderStats = await this.ordersService.getStats();
    return {
      totalOrders: orderStats.total,
      completedOrders: orderStats.completed,
      onProcessOrders: orderStats.onProcess,
      cancelledOrders: orderStats.cancelled,
    };
  }

  async getRevenue(period: 'week' | 'month' | 'year') {
    return this.ordersService.getRevenueByPeriod(period);
  }

  async getOrderTypes() {
    return this.ordersService.getOrderTypes();
  }

  async getRecentOrders(limit = 5) {
    return this.ordersService.getRecent(limit);
  }

  async getTrendingMenus(limit = 5) {
    return this.menuService.getTrending(limit);
  }

  async getCategories() {
    return this.menuService.getCategories();
  }
}
