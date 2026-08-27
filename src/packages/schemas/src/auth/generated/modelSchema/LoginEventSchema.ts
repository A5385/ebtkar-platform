import { z } from 'zod';

/////////////////////////////////////////
// LOGIN EVENT SCHEMA
/////////////////////////////////////////

export const LoginEventSchema = z.object({
  id: z.string(),
  loginAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  service: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
})

export type LoginEvent = z.infer<typeof LoginEventSchema>

export default LoginEventSchema;
