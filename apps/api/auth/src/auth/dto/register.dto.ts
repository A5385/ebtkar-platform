import { RegisterSchemaInput } from '@repo/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class RegisterDto extends createZodDto(RegisterSchemaInput) {}
