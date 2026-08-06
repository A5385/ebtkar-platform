import { z } from 'zod';

/////////////////////////////////////////
// LOGIN INFO SCHEMA
/////////////////////////////////////////

export const LoginInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  lastLogin: z.coerce.date(),
  code: z.string(),
  at: z.string(),
  rt: z.string(),
})

export type LoginInfo = z.infer<typeof LoginInfoSchema>

export default LoginInfoSchema;
