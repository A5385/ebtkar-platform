import {
    CheckEmailSchema,
    CreateUserSchema,
    UpdateUserSchema,
    VerifyEmailSchema,
} from '@org/schemas/auth';
import { createTypedZodDto } from './create-typed-zod-dto.js';

export class CheckEmailDto extends createTypedZodDto(CheckEmailSchema) {}

export class CreateUserDto extends createTypedZodDto(CreateUserSchema) {}

export class VerifyEmailDto extends createTypedZodDto(VerifyEmailSchema) {}

export class UpdateUserDto extends createTypedZodDto(UpdateUserSchema) {}
