import { Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '@org/constants';

@Controller()
export class AppController {
    @MessagePattern(MESSAGE_PATTERN.auth.welcome, Transport.TCP)
    getData() {
        return { message: 'Welcome to Auth Microservice' };
    }
}
