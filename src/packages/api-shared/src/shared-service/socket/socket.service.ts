// import { Injectable } from '@nestjs/common';
// import type { Server } from 'socket.io';

// @Injectable()
// export class SocketService {
//     private server: Server | null = null;

//     setServer(server: Server): void {
//         this.server = server;
//     }

//     emit<T>(event: string, payload: T): void {
//         if (!this.server) {
//             return;
//         }

//         console.log('[SocketService] Emitting:', event, payload);
//         console.log('[SocketService] Connected clients:', this.server.engine.clientsCount);

//         this.server.emit(event, payload);
//     }

//     isConnected(): boolean {
//         return this.server !== null;
//     }
// }
