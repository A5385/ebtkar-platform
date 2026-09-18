import { z } from 'zod';

/////////////////////////////////////////
// MODULE SCHEMA
/////////////////////////////////////////

export const ModuleSchema = z.object({
  moduleId: z.string(),
  name: z.string(),
  code: z.string(),
  appId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Module = z.infer<typeof ModuleSchema>

export default ModuleSchema;
