import { ChangeUserPasswordSchema, RegisterSchemaInput } from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class RegisterDto extends createZodDto(RegisterSchemaInput) {}

export class ChangePasswordDto extends createZodDto(ChangeUserPasswordSchema) {}
