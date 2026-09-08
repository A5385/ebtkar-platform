import { z } from 'zod';

export const StockTransactionScalarFieldEnumSchema = z.enum([
    'transactionId',
    'tenantId',
    'type',
    'referenceId',
    'notes',
    'createdAt',
]);

export default StockTransactionScalarFieldEnumSchema;
