import { z } from 'zod';

/////////////////////////////////////////
// TOKENS CONFIG SCHEMA
/////////////////////////////////////////

export const TokensConfigSchema = z.object({
  id: z.boolean(),
  accessTokenExp: z.number(),
  refreshTokenExp: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type TokensConfig = z.infer<typeof TokensConfigSchema>

export default TokensConfigSchema;
