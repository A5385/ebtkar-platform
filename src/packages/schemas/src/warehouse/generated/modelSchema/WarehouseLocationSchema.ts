import { z } from 'zod';

/////////////////////////////////////////
// WAREHOUSE LOCATION SCHEMA
/////////////////////////////////////////

export const WarehouseLocationSchema = z.object({
    locationId: z.string(),
    warehouseId: z.string(),
    name: z.string(),
    code: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type WarehouseLocation = z.infer<typeof WarehouseLocationSchema>;

export default WarehouseLocationSchema;
