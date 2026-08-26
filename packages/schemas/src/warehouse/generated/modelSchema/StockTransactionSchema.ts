import { z } from 'zod';
import { StockTransactionTypeSchema } from '../inputTypeSchemas/StockTransactionTypeSchema'

/////////////////////////////////////////
// STOCK TRANSACTION SCHEMA
/////////////////////////////////////////

export const StockTransactionSchema = z.object({
  type: StockTransactionTypeSchema,
  transactionId: z.string(),
  tenantId: z.string(),
  referenceId: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type StockTransaction = z.infer<typeof StockTransactionSchema>

export default StockTransactionSchema;
