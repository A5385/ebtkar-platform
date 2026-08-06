import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '@repo/api-dto';
import { MSM_PATTERN } from '@repo/api-shared';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(MSM_PATTERN.auth.login)
    login(@Payload() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
