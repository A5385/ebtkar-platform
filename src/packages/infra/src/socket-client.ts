// src\packages\infra\src\socket-client.ts
import { io, type Socket } from 'socket.io-client';

type SocketClientOptions = {
    url: string;
    event: string;
    listener: (...args: any[]) => void;
};

export const createSocketClient = ({ url, event, listener }: SocketClientOptions): (() => void) => {
    const socket: Socket = io(url, {
        transports: ['websocket'],
        reconnection: true,
    });

    socket.on(event, listener);

    return () => {
        socket.off(event, listener);
        socket.disconnect();
    };
};
