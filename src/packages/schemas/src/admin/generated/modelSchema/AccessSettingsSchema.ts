import { z } from 'zod';

/////////////////////////////////////////
// ACCESS SETTINGS SCHEMA
/////////////////////////////////////////

export const AccessSettingsSchema = z.object({
  id: z.boolean(),
  corsEnabled: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AccessSettings = z.infer<typeof AccessSettingsSchema>

export default AccessSettingsSchema;
