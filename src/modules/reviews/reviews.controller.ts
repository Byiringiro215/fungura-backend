import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(
    @Query('rating') rating?: number, @Query('category') category?: string,
    @Query('sort') sort?: string, @Query('page') page?: number, @Query('limit') limit?: number,
  ) { return this.reviewsService.findAll({ rating, category, sort, page, limit }); }

  @Get('stats')
  getStats() { return this.reviewsService.getStats(); }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: Partial<Review>) { return this.reviewsService.create(data); }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.reviewsService.remove(id); }
}
