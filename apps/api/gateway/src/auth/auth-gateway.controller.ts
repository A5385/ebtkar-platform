import { Body, Controller, Post } from '@nestjs/common';

import { RegisterDto } from '@repo/api-dto';
import { AuthMicroserviceClient, RegisterResponse } from './auth-microservice.client';

@Controller('auth')
export class AuthGatewayController {
    constructor(private readonly authClient: AuthMicroserviceClient) {}

    @Post('register')
    async register(@Body() input: RegisterDto): Promise<RegisterResponse> {
        return await this.authClient.register(input);
    }
}
