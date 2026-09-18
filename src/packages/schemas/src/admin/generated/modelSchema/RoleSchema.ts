import { z } from 'zod';

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  roleId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isSuperAdmin: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Role = z.infer<typeof RoleSchema>

export default RoleSchema;
