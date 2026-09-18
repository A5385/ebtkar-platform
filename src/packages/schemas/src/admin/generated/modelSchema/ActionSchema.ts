import { z } from 'zod';

/////////////////////////////////////////
// ACTION SCHEMA
/////////////////////////////////////////

export const ActionSchema = z.object({
  actionId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
})

export type Action = z.infer<typeof ActionSchema>

export default ActionSchema;
