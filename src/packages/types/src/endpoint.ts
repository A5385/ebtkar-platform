// This file is auto-generated. Do not edit manually.

export type EndpointType =
    | '/'
    | 'admin-config/global-settings'
    | 'admin-config/network-settings'
    | 'admin-config/token-settings'
    | 'admin-origin/create-origin'
    | `admin-origin/delete-origin/${string}`
    | `admin-origin/find-origin-by-id/${string}`
    | `admin-origin/find-origins-by-access-id/${string}`
    | 'admin-origin/get-all-origins'
    | 'admin-origin/update-origin'
    | 'auth/consume-tokens'
    | 'auth/login'
    | 'auth/logout'
    | 'auth/refresh-token'
    | 'auth/welcome'
    | 'profile/create'
    | `profile/find-profile-by-id/${string}`
    | `profile/find-profile-by-user-email/${string}`
    | `profile/find-profile-By-user-id/${string}`
    | 'profile/update'
    | 'user/change-forget-password'
    | 'user/change-password'
    | 'user/check-email'
    | 'user/confirm-delete-user'
    | 'user/create-user'
    | `user/delete-user/${string}`
    | `user/find-user-by-email/${string}`
    | `user/find-user-by-id/${string}`
    | 'user/get-all-users'
    | `user/hard-delete-user/${string}`
    | 'user/send-forget-password-otp'
    | 'user/set-new-password'
    | 'user/update-user'
    | 'user/verify-email'
;
