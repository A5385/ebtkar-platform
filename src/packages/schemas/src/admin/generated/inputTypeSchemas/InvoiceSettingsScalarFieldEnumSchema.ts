import { z } from 'zod';

export const InvoiceSettingsScalarFieldEnumSchema = z.enum(['invoiceSettingsId','name','logo','code','createdAt','updatedAt']);

export default InvoiceSettingsScalarFieldEnumSchema;
