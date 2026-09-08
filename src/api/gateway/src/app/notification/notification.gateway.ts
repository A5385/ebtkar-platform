import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, type OnGatewayInit } from '@nestjs/websockets';
import { apiEnv } from '@org/api-shared';
import type { AdminNotification, RealtimeAdminNotification } from '@org/types';
import { jwtVerify } from 'jose';
import type { Server } from 'socket.io';

function getCookie(cookieHeader: string | undefined, name: string): string | undefined {
    return cookieHeader
        ?.split(';')
        .map((value) => value.trim().split('='))
        .find(([key]) => key === name)?.[1];
}

@WebSocketGateway({
    namespace: '/notifications',
    cors: {
        origin: [apiEnv.get('ADMIN_URL')].filter((value): value is string => Boolean(value)),
        credentials: true,
    },
})
export class NotificationGateway implements OnGatewayInit {
    private readonly logger = new Logger(NotificationGateway.name);

    @WebSocketServer()
    private readonly server!: Server;

    afterInit(server: Server): void {
        server.use(async (socket, next) => {
            try {
                const token = getCookie(socket.handshake.headers.cookie, 'access_token')
                    ?? getCookie(socket.handshake.headers.cookie, 'accessToken');
                const secret = apiEnv.get('ACCESS_TOKEN_SECRET');
                if (!token || !secret) return next(new Error('Unauthorized'));
                const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
                if (payload.role !== 'ADMIN') return next(new Error('Forbidden'));
                next();
            } catch {
                next(new Error('Unauthorized'));
            }
        });
        this.logger.log('Admin notification WebSocket initialized');
    }

    publish(notification: AdminNotification): void {
        const safeNotification: RealtimeAdminNotification = {
            notificationId: notification.notificationId,
            title: notification.title,
            message: notification.message,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
        this.server.emit('notification.created', safeNotification);
    }
}
