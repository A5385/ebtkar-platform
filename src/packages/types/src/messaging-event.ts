export interface OtpEmailRequestedEvent {
    userId: string;
    email: string;
    otp: string;
}

export interface UserCreatedEvent {
    userId: string;
    email: string;
    role: string;
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

export interface NotificationCreatedEvent {
    notification: AdminNotification;
}

export type RealtimeAdminNotification = Pick<
    AdminNotification,
    'notificationId' | 'title' | 'message' | 'readAt' | 'createdAt'
>;
