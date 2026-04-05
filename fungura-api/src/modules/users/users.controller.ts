import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: User, @Body() data: Partial<User>) {
    const { password, email, role, refreshToken, ...safeData } = data;
    return this.usersService.update(user.id, safeData);
  }

  @Get('me/settings')
  getSettings(@CurrentUser() user: User) {
    return this.usersService.findById(user.id).then((u) => u.settings);
  }

  @Patch('me/settings')
  updateSettings(
    @CurrentUser() user: User,
    @Body() settings: Record<string, unknown>,
  ) {
    return this.usersService.updateSettings(user.id, settings);
  }
}
