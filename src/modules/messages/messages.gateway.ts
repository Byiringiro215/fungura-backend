import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({ namespace: 'messages', cors: { origin: '*' } })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { senderId: string; receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.sendMessage(data.senderId, data.receiverId, data.text);
    this.server.to(data.receiverId).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
  }
}
