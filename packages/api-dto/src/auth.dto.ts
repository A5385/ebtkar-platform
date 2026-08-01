import { RegisterSchemaInput } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RegisterDto extends createZodDto(RegisterSchemaInput) {}
