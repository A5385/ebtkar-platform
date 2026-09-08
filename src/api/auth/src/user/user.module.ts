import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT } from '../microservice.js';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    imports: [ClientsModule.register([{ ...MICROSERVICE_CLIENT.authEvents }])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
