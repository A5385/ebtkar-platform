import { z } from 'zod';

/////////////////////////////////////////
// GLOBAL SETTINGS SCHEMA
/////////////////////////////////////////

export const GlobalSettingsSchema = z.object({
  id: z.boolean(),
  platformName: z.string(),
  maintenanceMode: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>

export default GlobalSettingsSchema;
