import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '@repo/api-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto);
    }
}
