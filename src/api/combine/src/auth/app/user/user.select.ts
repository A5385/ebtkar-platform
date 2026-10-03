import { AuthPrisma } from '@org/database-auth';

export const userSelect = {
    userId: true,
    email: true,
    role: true,
    isVerified: true,
    isBlocked: true,
    isActive: true,
    isDelete: true,
    deleteAt: true,
    createdAt: true,
    updatedAt: true,
    profile: {
        select: {
            profileId: true,
            fullName: true,
            mobile: true,
            address: true,
            createdAt: true,
        },
    },
} satisfies AuthPrisma.UserSelect;
