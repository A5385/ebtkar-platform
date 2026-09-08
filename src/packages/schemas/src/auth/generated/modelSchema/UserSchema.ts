import { z } from 'zod';
import { RoleSchema } from '../inputTypeSchemas/RoleSchema.js'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema.nullable(),
  userId: z.string(),
  email: z.string(),
  password: z.string().nullable(),
  otp: z.number().nullable(),
  isVerified: z.coerce.date().nullable(),
  isBlocked: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
