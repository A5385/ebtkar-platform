export const EVENT_PATTERN = {
    auth: {
        otpEmailRequested: 'auth.otp.email.requested.v1',
        userCreated: 'auth.user.created.v1',
        otpVerifyUserHardDelete: 'auth.otp.email.delete.v1',
        forgetPasswordOtp: 'auth.forget.password.otp.v1',
    },
    messaging: {
        notificationCreated: 'messaging.notification.created.v1',
    },
    admin: {
        configUpdated: 'admin.config.updated.v1',
        configSync: 'admin.config.sync.v1',
    },
} as const;
