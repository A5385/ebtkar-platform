import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('login')
    async login() {
        return;
    }

    @Get('refresh-token')
    async refreshToken() {
        return;
    }

    @Get('consume-tokens')
    async consumeTokens() {
        return;
    }

    @Post('logout')
    async logout() {
        return;
    }
}
