import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT } from '../../microservice.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
    imports: [ClientsModule.register([{ ...MICROSERVICE_CLIENT.authEvents }])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
