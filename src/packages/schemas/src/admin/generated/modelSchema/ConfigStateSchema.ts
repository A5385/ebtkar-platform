import { z } from 'zod';

/////////////////////////////////////////
// CONFIG STATE SCHEMA
/////////////////////////////////////////

export const ConfigStateSchema = z.object({
  id: z.boolean(),
  version: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ConfigState = z.infer<typeof ConfigStateSchema>

export default ConfigStateSchema;
