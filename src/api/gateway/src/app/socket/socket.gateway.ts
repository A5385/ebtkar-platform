import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3005, {
    cors: {
        origin: 'http://localhost:7000',
        credentials: true,
    },
})
export class SocketGateway {
    @WebSocketServer()
    server!: Server;

    afterInit(server: Server): void {
        this.server = server;

        console.log('[SocketGateway] Socket.IO initialized');
    }

    emit<T>(event: string, payload: T): void {
        if (!this.server) {
            return;
        }

        console.log('[SocketGateway] Emitting:', event, payload);
        console.log('[SocketGateway] Connected clients:', this.server.engine.clientsCount);

        this.server.emit(event, payload);
    }
}
