import { AuthPrisma } from '@org/database-auth';

export const profileSelect = {
    profileId: true,
    fullName: true,
    mobile: true,
    address: true,
    createdAt: true,
    user: {
        select: {
            userId: true,
            role: true,
            email: true,
            isVerified: true,
            isBlocked: true,
            isActive: true,
            isDelete: true,
            deleteAt: true,
            createdAt: true,
            updatedAt: true,
        },
    },
} satisfies AuthPrisma.ProfileSelect;
