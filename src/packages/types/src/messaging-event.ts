export interface EventEnvelope {
    eventId: string;
    occurredAt: string;
}

export interface OtpEmailRequestedEvent extends EventEnvelope {
    userId: string;
    email: string;
    otp: string;
}

export interface UserCreatedEvent extends EventEnvelope {
    userId: string;
    email: string;
    role: 'TENANT' | 'ADMIN';
}

export interface AdminNotification {
    notificationId: string;
    eventId: string;
    title: string;
    message: string;
    metadata: unknown;
    readAt: string | Date | null;
    createdAt: string | Date;
}

export interface NotificationCreatedEvent extends EventEnvelope {
    notification: AdminNotification;
}

export type RealtimeAdminNotification = Pick<
    AdminNotification,
    'notificationId' | 'title' | 'message' | 'readAt' | 'createdAt'
>;
