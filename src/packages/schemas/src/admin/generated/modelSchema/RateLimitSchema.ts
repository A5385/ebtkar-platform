import { z } from 'zod';

/////////////////////////////////////////
// RATE LIMIT SCHEMA
/////////////////////////////////////////

export const RateLimitSchema = z.object({
  rateLimitId: z.string(),
  name: z.string(),
  limit: z.number(),
  ttl: z.number(),
  networkSettingId: z.boolean().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type RateLimit = z.infer<typeof RateLimitSchema>

export default RateLimitSchema;
