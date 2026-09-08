import type { RealtimeAdminNotification } from '@org/types';
import { toast, webEnv } from '@org/shared-web';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

interface NotificationContextValue {
    notifications: RealtimeAdminNotification[];
}

const NotificationContext = createContext<NotificationContextValue>({ notifications: [] });

export function NotificationSocketProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<RealtimeAdminNotification[]>([]);

    useEffect(() => {
        const gatewayUrl = webEnv.get('API_GATEWAY_URL') ?? 'http://localhost:4000';
        const gatewayOrigin = new URL(gatewayUrl, window.location.origin).origin;
        const socket = io(`${gatewayOrigin}/notifications`, { withCredentials: true });
        const onCreated = (notification: RealtimeAdminNotification) => {
            setNotifications((current) => [notification, ...current]);
            toast.add({ title: notification.title, description: notification.message, type: 'info' });
        };
        socket.on('notification.created', onCreated);
        return () => {
            socket.off('notification.created', onCreated);
            socket.disconnect();
        };
    }, []);

    const value = useMemo(() => ({ notifications }), [notifications]);
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useAdminNotifications = () => useContext(NotificationContext);
