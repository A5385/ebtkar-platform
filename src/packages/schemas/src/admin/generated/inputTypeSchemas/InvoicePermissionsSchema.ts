import { z } from 'zod';

export const InvoicePermissionsSchema = z.enum(['INVOICE_CREATE','INVOICE_UPDATE','INVOICE_DELETE','INVOICE_ARCHIVE','INVOICE_READ']);

export type InvoicePermissionsType = `${z.infer<typeof InvoicePermissionsSchema>}`

export default InvoicePermissionsSchema;
