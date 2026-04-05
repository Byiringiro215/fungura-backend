import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { WorkersService } from './workers.service';
import { Worker } from './entities/worker.entity';

@ApiTags('Workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  findAll(@Query('role') role?: string, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.workersService.findAll({ role, search, page, limit });
  }

  @Get('stats')
  getStats() { return this.workersService.getStats(); }

  @Get('drivers')
  getDrivers() { return this.workersService.getDrivers(); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.workersService.findById(id); }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() data: Partial<Worker>) { return this.workersService.create(data); }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() data: Partial<Worker>) { return this.workersService.update(id, data); }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) { return this.workersService.remove(id); }
}
