import { Controller, HttpException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { RegisterDto } from '@repo/api-dto';
import { AuthService } from './auth.service';

interface RpcErrorPayload {
    statusCode: number;
    message: string | string[];
}

@Controller()
export class AuthMessageController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('auth.register')
    async register(@Payload() payload: RegisterDto): Promise<
        | {
              message: string;
          }
        | undefined
    > {
        try {
            return await this.authService.register(payload);
        } catch (error: unknown) {
            if (error instanceof HttpException) {
                const response = error.getResponse();

                const message = typeof response === 'string' ? response : 'Bad Request';

                throw new RpcException({
                    statusCode: error.getStatus(),
                    message,
                } satisfies RpcErrorPayload);
            }

            throw new RpcException({
                statusCode: 500,
                message: 'Internal authentication service error',
            } satisfies RpcErrorPayload);
        }
    }
}
