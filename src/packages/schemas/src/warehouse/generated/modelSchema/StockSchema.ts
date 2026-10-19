import { z } from 'zod';
import { Decimal as PrismaDecimal } from '@org/database-warehouse/prisma-namespace';

/////////////////////////////////////////
// STOCK SCHEMA
/////////////////////////////////////////

export const StockSchema = z.object({
  stockId: z.string(),
  tenantId: z.string(),
  warehouseId: z.string(),
  locationId: z.string().nullable(),
  itemId: z.string(),
  quantity: z.instanceof(PrismaDecimal, { message: "Field 'quantity' must be a Decimal. Location: ['Models', 'Stock']"}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Stock = z.infer<typeof StockSchema>

export default StockSchema;
