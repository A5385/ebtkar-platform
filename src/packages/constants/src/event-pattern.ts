export const EVENT_PATTERN = {
    auth: {
        otpEmailRequested: 'auth.otp.email.requested.v1',
        userCreated: 'auth.user.created.v1',
    },
    messaging: {
        notificationCreated: 'messaging.notification.created.v1',
    },
} as const;
