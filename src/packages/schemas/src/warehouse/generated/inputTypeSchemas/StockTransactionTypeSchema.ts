import { z } from 'zod';

export const StockTransactionTypeSchema = z.enum(['RECEIPT','ISSUE','TRANSFER','ADJUSTMENT','RETURN']);

export type StockTransactionTypeType = `${z.infer<typeof StockTransactionTypeSchema>}`

export default StockTransactionTypeSchema;
