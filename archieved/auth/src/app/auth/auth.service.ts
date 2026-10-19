import { Injectable } from '@nestjs/common';
import { LoginDto } from '@org/api-dto';

@Injectable()
export class AuthService {
    login(createAuthDto: LoginDto) {
        return;
    }
}
