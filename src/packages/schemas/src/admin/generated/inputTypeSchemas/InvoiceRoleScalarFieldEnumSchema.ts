import { z } from 'zod';

export const InvoiceRoleScalarFieldEnumSchema = z.enum(['InvoiceRoleId','name','description','isSuperAdmin','invoiceSettingsId','permissions','createdAt','updatedAt']);

export default InvoiceRoleScalarFieldEnumSchema;
