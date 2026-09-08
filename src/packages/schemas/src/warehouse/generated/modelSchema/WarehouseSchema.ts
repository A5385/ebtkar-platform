import { z } from 'zod';

/////////////////////////////////////////
// WAREHOUSE SCHEMA
/////////////////////////////////////////

export const WarehouseSchema = z.object({
    warehouseId: z.string(),
    tenantId: z.string(),
    code: z.string(),
    name: z.string(),
    isActive: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

export default WarehouseSchema;
