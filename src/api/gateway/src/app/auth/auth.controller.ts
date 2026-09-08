import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '@org/constants';
import { MICROSERVICE_CLIENT } from '../../microservice';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.auth.name)
        private readonly authService: ClientProxy,
    ) {}

    @Get('welcome')
    async welcome() {
        return this.authService.send(MESSAGE_PATTERN.auth.welcome, {});
    }
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
