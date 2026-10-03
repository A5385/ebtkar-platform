import { z } from 'zod';
import { WarehousePermissionsSchema } from '../inputTypeSchemas/WarehousePermissionsSchema.js'

/////////////////////////////////////////
// WAREHOUSE ROLE SCHEMA
/////////////////////////////////////////

export const WarehouseRoleSchema = z.object({
  permissions: WarehousePermissionsSchema.array(),
  warehouseRoleId: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  isSuperAdmin: z.boolean(),
  warehouseSettingsId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WarehouseRole = z.infer<typeof WarehouseRoleSchema>

export default WarehouseRoleSchema;
