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
};
