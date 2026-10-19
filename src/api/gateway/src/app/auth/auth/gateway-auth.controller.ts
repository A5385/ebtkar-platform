import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Throttle } from '@nestjs/throttler';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { MESSAGE_PATTERN, RATE_LIMITS } from '@org/constants';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.combine.name)
        private readonly authService: ClientProxy,
    ) {}

    @Get('welcome')
    async welcome() {
        return this.authService.send(MESSAGE_PATTERN.auth.welcome, {});
    }
    @Throttle({
        default: RATE_LIMITS.login,
    })
    @Post('login')
    async login() {
        return this.authService.send(MESSAGE_PATTERN.auth.auth.login, {});
    }

    @Get('refresh-token')
    async refreshToken() {
        return this.authService.send(MESSAGE_PATTERN.auth.auth.refreshToken, {});
    }

    @Get('consume-tokens')
    async consumeTokens() {
        return this.authService.send(MESSAGE_PATTERN.auth.auth.consumeTokens, {});
    }

    @Post('logout')
    async logout() {
        return this.authService.send(MESSAGE_PATTERN.auth.auth.logout, {});
    }
}
