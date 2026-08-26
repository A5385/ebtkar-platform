import { z } from 'zod';

export const StockTransactionLineScalarFieldEnumSchema = z.enum(['lineId','transactionId','itemId','fromWarehouseId','fromLocationId','toWarehouseId','toLocationId','quantity','createdAt']);

export default StockTransactionLineScalarFieldEnumSchema;
