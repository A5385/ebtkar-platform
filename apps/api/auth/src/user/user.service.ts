//apps\api\auth\src\user\user.service.ts
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '@repo/api-dto';
import { ErrorService, handleApiResponse } from '@repo/api-shared';
import { AuthPrismaService } from '@repo/auth-database';
import { LocaleType } from '@repo/types';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: AuthPrismaService,
        private readonly error: ErrorService,
    ) {}

    private moduleName = 'User';

    async register({ email, password }: RegisterDto, locale: LocaleType = 'en') {
        if (!email && !password) this.error.notFound('Email and password is required.');

        const hashedPassword = await hash(password, 12);

        const user = await this.findUserByEmail(email, locale);

        if (user && user.payload) this.error.conflict('User already Exist.');

        return await handleApiResponse({
            method: 'create',
            locale,
            moduleName: this.moduleName,
            fn: async () => {
                return await this.prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });
            },
        });
    }

    async findUserByEmail(email: string, locale?: LocaleType) {
        if (!email) this.error.notFound('User Email is Required.');

        return await handleApiResponse({
            method: 'find-by',
            locale,
            moduleName: this.moduleName,
            getBy: { key: 'email', value: email },
            fn: async () => await this.prisma.user.findUnique({ where: { email } }),
        });
    }

    async findUserById(userId: string, locale?: LocaleType) {
        if (!userId) this.error.notFound('User ID is Required.');

        return await handleApiResponse({
            method: 'find-by-id',
            locale,
            moduleName: this.moduleName,
            id: userId,
            fn: async () => await this.prisma.user.findUnique({ where: { userId } }),
        });
    }

    async getAllUsers(locale?: LocaleType) {
        return await handleApiResponse({
            method: 'get-all',
            moduleName: this.moduleName,
            locale,
            fn: async () => await this.prisma.user.findMany(),
        });
    }
}
