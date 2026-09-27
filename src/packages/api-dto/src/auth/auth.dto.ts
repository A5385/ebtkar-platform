import { LoginSchema } from '@org/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(LoginSchema) {}
