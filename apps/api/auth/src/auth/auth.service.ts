import { Injectable } from '@nestjs/common';
import { LoginDto } from '@repo/api-dto';
import { ErrorService, WinstonLoggerService } from '@repo/api-shared';
import { AuthPrismaService } from '@repo/auth-database';
import { compare } from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: AuthPrismaService,
        private readonly userService: UserService,
        private readonly error: ErrorService,
        private readonly logger: WinstonLoggerService,
    ) {}

    private get shared() {
        return {
            moduleName: 'user',
            logger: this.logger,
        };
    }
    async login({ email, password }: LoginDto) {
        if (!email && !password)
            this.error.notFound('email_and_password_is_required.', this.shared.moduleName);

        const userExist = await this.userService.findUserByEmail(email);

        if (!userExist) this.error.notFound('user_not_found', this.shared.moduleName);

        if (!userExist.payload?.password)
            this.error.notFound('user_password_is_not_set', this.shared.moduleName);

        const passwordMatch = await compare(password, userExist.payload?.password);

        if (!passwordMatch)
            this.error.unauthorized('email_or_password_are_not_matched', this.shared.moduleName);
    }
}
