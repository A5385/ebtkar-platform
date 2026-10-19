import { z } from 'zod';

/////////////////////////////////////////
// NETWORK SETTINGS SCHEMA
/////////////////////////////////////////

export const NetworkSettingsSchema = z.object({
  id: z.boolean(),
  httpClientRetries: z.number(),
  requestTimeoutMs: z.number(),
  paginationPageSize: z.number(),
  retryDelay: z.number(),
  retryStatusCodes: z.number().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type NetworkSettings = z.infer<typeof NetworkSettingsSchema>

export default NetworkSettingsSchema;
