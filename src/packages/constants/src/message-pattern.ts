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
            createUser: 'CREATE_USER',
            verifyEmail: 'VERIFY_EMAIL',
            verifyOtp: 'VERIFY_OTP',
            setNewPassword: 'SET_NEW_PASSWORD',
            changePassword: 'CHANGE_PASSWORD',
            sendForgetPasswordOtp: 'SEND_FORGET_PASSWORD_OTP',
            changeForgetPassword: 'CHANGE_FORGET_PASSWORD',
            getAllUsers: 'GET_ALL_USERS',
            findUserById: 'FIND_USER_BY_ID',
            findUserByEmail: 'FIND_USER_BY_EMAIL',
            updateUser: 'UPDATE_USER',
            deleteUser: 'DELETE_USER',
            hardDeleteUser: 'HARD_DELETE_USER',
            confirmDeleteUser: 'CONFIRM_DELETE_USER',
        },
        profile: {
            createProfile: 'CREATE_PROFILE',
            updateProfile: 'UPDATE_PROFILE',
            getProfileById: 'GET_PROFILE_BY_ID',
            getProfileByUserId: 'GET_PROFILE_BY_USER_ID',
            getProfileByUserEmail: 'GET_PROFILE_BY_USER_EMAIL',
        },
    },
    messaging: {
        notification: {
            getAdminNotifications: 'GET_ADMIN_NOTIFICATIONS',
        },
    },
    admin: {
        config: {
            getSnapshot: 'ADMIN_CONFIG_GET_SNAPSHOT',
            sync: 'ADMIN_CONFIG_SYNC',
            updateGlobal: 'ADMIN_CONFIG_UPDATE_GLOBAL',
            updateNetwork: 'ADMIN_CONFIG_UPDATE_NETWORK',
            updateTokens: 'ADMIN_CONFIG_UPDATE_TOKENS',
            updateAccess: 'ADMIN_CONFIG_UPDATE_ACCESS',
        },
        access: {
            create: 'CREATE_ORIGIN',
            update: 'UPDATE_ORIGIN',
            getAll: 'GET_ALL_ORIGIN',
            delete: 'DELETE_ORIGIN',
            findById: 'FIND_BY_ID',
            findByAccessId: 'FIND_BY_ACCESS_ID',
        },
    },
};
