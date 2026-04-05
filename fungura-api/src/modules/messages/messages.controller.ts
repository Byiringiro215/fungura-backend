import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';
import { User } from '../users/entities/user.entity';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('contacts')
  getContacts(@CurrentUser() user: User) { return this.messagesService.getContacts(user.id); }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: User) { return this.messagesService.getUnreadCount(user.id); }

  @Get(':contactId')
  getConversation(@CurrentUser() user: User, @Param('contactId') contactId: string) {
    return this.messagesService.getConversation(user.id, contactId);
  }

  @Post(':contactId')
  sendMessage(
    @CurrentUser() user: User,
    @Param('contactId') contactId: string,
    @Body('text') text: string,
  ) { return this.messagesService.sendMessage(user.id, contactId, text); }
}
