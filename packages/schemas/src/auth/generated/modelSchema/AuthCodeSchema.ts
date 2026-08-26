import { z } from 'zod';

/////////////////////////////////////////
// AUTH CODE SCHEMA
/////////////////////////////////////////

export const AuthCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  expiresAt: z.coerce.date().nullable(),
  consumedAt: z.coerce.date().nullable(),
  /**
   * ///////////////////////////
   */
  userId: z.string(),
  createdAt: z.coerce.date(),
})

export type AuthCode = z.infer<typeof AuthCodeSchema>

export default AuthCodeSchema;
