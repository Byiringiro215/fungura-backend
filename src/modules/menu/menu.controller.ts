import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { MenuService } from './menu.service';
import { MenuItem } from './entities/menu-item.entity';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('mealTime') mealTime?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.menuService.findAll({ category, mealTime, search, sort, page, limit });
  }

  @Get('categories')
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get('trending')
  getTrending(@Query('limit') limit?: number) {
    return this.menuService.getTrending(limit);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.menuService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() data: Partial<MenuItem>) {
    return this.menuService.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() data: Partial<MenuItem>) {
    return this.menuService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
