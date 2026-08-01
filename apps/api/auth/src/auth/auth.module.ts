import { Module } from '@nestjs/common';
import { AuthMessageController } from './auth-message.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController, AuthMessageController],
    providers: [AuthService],
})
export class AuthModule {}
