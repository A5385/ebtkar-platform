// src\packages\schemas\src\auth\response\user-response.schema.ts

export type DefaultUserMutationResponse = { userId: string };
export type CheckEmailResponseType = { available: boolean };
export type DeleteUserResponseType = { isDelete: boolean | null };

export type UserResponseType = {
    userId: string;
    email: string;
    role: string | null;
    isVerified: Date | null;
    isBlocked: boolean;
    isActive: boolean;
    isDelete: boolean | null;
    deleteAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

    profileId: string | null;
    fullName: string | null;
    mobile: string | null;
    address: string | null;
    profileCreatedAt: Date | null;
};
export type GetAllUserResponse = UserResponseType[];

/**
 * Profile Response Type
 */

export type CreateProfileResponseType = {
    userId: string;
    createdAt: Date;
    profileId: string;
    fullName: string | null;
    mobile: string | null;
    address: string | null;
};

export type GetProfileResponseType = {
    createdAt?: Date | undefined;
    profileId?: string | undefined;
    fullName?: string | null | undefined;
    mobile?: string | null | undefined;
    address?: string | null | undefined;
    userId?: string | undefined;
    role?: string | null | undefined;
    email?: string | undefined;
    isVerified?: Date | null | undefined;
    isBlocked?: boolean | undefined;
    isActive?: boolean | undefined;
    isDelete?: boolean | null | undefined;
    deleteAt?: Date | null | undefined;
    userCreateAt: Date | undefined;
    userUpdateAt: Date | undefined;
};
