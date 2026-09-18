import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  userId: z.string(),
  role: z.string().nullable(),
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
