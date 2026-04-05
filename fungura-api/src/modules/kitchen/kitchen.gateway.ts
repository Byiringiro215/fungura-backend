import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { KitchenService } from './kitchen.service';
import { KitchenStatus } from '../orders/entities/order.entity';

@WebSocketGateway({
  namespace: 'kitchen',
  cors: { origin: '*' },
})
export class KitchenGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kitchenService: KitchenService) {}

  @SubscribeMessage('updateOrderStatus')
  async handleStatusUpdate(
    @MessageBody() data: { orderId: string; status: KitchenStatus },
    @ConnectedSocket() client: Socket,
  ) {
    const order = await this.kitchenService.updateKitchenStatus(data.orderId, data.status);
    this.server.emit('orderStatusUpdated', order);
    return order;
  }

  @SubscribeMessage('getOrders')
  async handleGetOrders(@ConnectedSocket() client: Socket) {
    const orders = await this.kitchenService.getActiveOrders();
    client.emit('activeOrders', orders);
  }
}
