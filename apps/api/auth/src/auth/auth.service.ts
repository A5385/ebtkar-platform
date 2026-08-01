import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from '@repo/api-dto';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register({ email, password }: RegisterDto) {
        const user = await this.prisma.client.user.findUnique({ where: { email } });
        if (user) throw new ConflictException('User Already Exists');

        const hashedPassword = await hash(password, 12);

        if (!hashedPassword) throw new ConflictException('Password Hashing Failed');

        try {
            const user = await this.prisma.client.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            if (user) {
                return {
                    message: 'User Created Successfully',
                };
            }
        } catch (error) {
            throw new ConflictException('User Creation Failed', JSON.stringify(error, null, 2));
        }
    }
}
