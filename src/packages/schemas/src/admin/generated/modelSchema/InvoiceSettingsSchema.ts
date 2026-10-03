import { z } from 'zod';

/////////////////////////////////////////
// INVOICE SETTINGS SCHEMA
/////////////////////////////////////////

export const InvoiceSettingsSchema = z.object({
  invoiceSettingsId: z.string(),
  name: z.string(),
  logo: z.string().nullable(),
  code: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InvoiceSettings = z.infer<typeof InvoiceSettingsSchema>

export default InvoiceSettingsSchema;
