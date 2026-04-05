import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
