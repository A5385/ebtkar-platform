import { z } from 'zod';

/////////////////////////////////////////
// GLOBAL SETTINGS SCHEMA
/////////////////////////////////////////

export const GlobalSettingsSchema = z.object({
  id: z.boolean(),
  platformName: z.string(),
  logo: z.string().nullable(),
  favicon: z.string().nullable(),
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
  defaultLocale: z.string(),
  defaultTimezone: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>

export default GlobalSettingsSchema;
