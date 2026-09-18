import { z } from 'zod';

/////////////////////////////////////////
// APP SCHEMA
/////////////////////////////////////////

export const AppSchema = z.object({
  appId: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type App = z.infer<typeof AppSchema>

export default AppSchema;
