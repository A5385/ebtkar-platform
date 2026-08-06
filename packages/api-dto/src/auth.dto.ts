import { loginSchema } from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class LoginDto extends createZodDto(loginSchema) {}
