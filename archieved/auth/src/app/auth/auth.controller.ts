import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(MESSAGE_PATTERN.auth.auth.login)
    create(@Payload() createAuthDto: LoginDto) {
        return this.authService.login(createAuthDto);
    }
}
