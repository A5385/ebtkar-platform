import { z } from 'zod';

/////////////////////////////////////////
// WAREHOUSE SETTINGS SCHEMA
/////////////////////////////////////////

export const WarehouseSettingsSchema = z.object({
  warehouseSettingsId: z.string(),
  name: z.string(),
  logo: z.string().nullable(),
  code: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WarehouseSettings = z.infer<typeof WarehouseSettingsSchema>

export default WarehouseSettingsSchema;
