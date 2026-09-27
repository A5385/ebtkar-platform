import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [ClientsModule.register([{ ...MICROSERVICE_CLIENT.authEvents }])],
    controllers: [ProfileController],
    providers: [ProfileService, UserService],
})
export class ProfileModule {}
