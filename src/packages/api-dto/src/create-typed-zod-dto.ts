import { createZodDto } from 'nestjs-zod';
import type { ZodType, output } from 'zod';

/**
 * Creates a Nest-compatible Zod DTO whose instance properties are inferred
 * from the schema, including transforms and optional fields.
 *
 * This keeps the runtime metadata required by ZodValidationPipe while working
 * around the lost instance inference in TypeScript 6 + nestjs-zod 5.5.
 */
export const createTypedZodDto = <TSchema extends ZodType>(schema: TSchema) =>
    createZodDto(schema) as unknown as new () => output<TSchema>;
