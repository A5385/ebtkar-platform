export const MESSAGE_PATTERN = {
    auth: {
        welcome: 'welcome',
        auth: {
            login: 'LOGIN',
            refreshToken: 'REFRESH_TOKEN',
            logout: 'LOGOUT',
            consumeTokens: 'CONSUME_TOKENS',
        },
        user: {
            checkEmail: 'CHECK_EMAIL',
            verifyEmail: 'VERIFY_EMAIL',
            verifyOtp: 'VERIFY_OTP',
            setNewPassword: 'SET_NEW_PASSWORD',
            createProfile: 'CREATE_PROFILE',
            updateProfile: 'UPDATE_PROFILE',
            createUser: 'CREATE_USER',
            getAllUsers: 'GET_ALL_USERS',
            findUserById: 'FIND_USER_BY_ID',
            findUserByEmail: 'FIND_USER_BY_EMAIL',
            updateUser: 'UPDATE_USER',
            deleteUser: 'DELETE_USER',
        },
    },
    messaging: {
        notification: {
            getAdminNotifications: 'GET_ADMIN_NOTIFICATIONS',
        },
    },
};
