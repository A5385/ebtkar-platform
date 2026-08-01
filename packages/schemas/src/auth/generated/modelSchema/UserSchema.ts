import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  userId: z.string(),
  email: z.string(),
  password: z.string(),
  otp: z.number().nullable(),
  isVerified: z.coerce.date().nullable(),
  isBlocked: z.boolean().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
