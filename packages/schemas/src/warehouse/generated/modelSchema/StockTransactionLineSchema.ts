import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../../../../../../database/warehouse/src/generated/prisma/internal/prismaNamespace';

/////////////////////////////////////////
// STOCK TRANSACTION LINE SCHEMA
/////////////////////////////////////////

export const StockTransactionLineSchema = z.object({
  lineId: z.string(),
  transactionId: z.string(),
  itemId: z.string(),
  fromWarehouseId: z.string().nullable(),
  fromLocationId: z.string().nullable(),
  toWarehouseId: z.string().nullable(),
  toLocationId: z.string().nullable(),
  quantity: z.instanceof(PrismaDecimal, { message: "Field 'quantity' must be a Decimal. Location: ['Models', 'StockTransactionLine']"}),
  createdAt: z.coerce.date(),
})

export type StockTransactionLine = z.infer<typeof StockTransactionLineSchema>

export default StockTransactionLineSchema;
