import { z } from 'zod';

/////////////////////////////////////////
// WAREHOUSE SCHEMA
/////////////////////////////////////////

export const WarehouseSchema = z.object({
  warehouseId: z.string(),
  service: z.string(),
  /**
   * ////////
   */
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Warehouse = z.infer<typeof WarehouseSchema>

export default WarehouseSchema;
