const minutes = (value = 1) => value * 60 * 1000;

export const RATE_LIMITS = {
    default: {
        ttl: minutes(),
        limit: 100,
    },
    login: {
        ttl: minutes(),
        limit: 5,
    },
    otpAndPswReset: {
        ttl: minutes(5),
        limit: 5,
    },
    reports: {
        ttl: minutes(),
        limit: 20,
    },
    fileUpload: {
        ttl: minutes(),
        limit: 10,
    },
} as const;
