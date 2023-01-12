import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebSocketService {
  @WebSocketServer()
  readonly server: Server;

  emit(messageName: string, data: unknown): boolean {
    return this.server.emit(messageName, data);
  }
}
