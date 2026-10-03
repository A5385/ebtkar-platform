import { z } from 'zod';
import { InvoicePermissionsSchema } from '../inputTypeSchemas/InvoicePermissionsSchema.js'

/////////////////////////////////////////
// INVOICE ROLE SCHEMA
/////////////////////////////////////////

export const InvoiceRoleSchema = z.object({
  permissions: InvoicePermissionsSchema.array(),
  InvoiceRoleId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isSuperAdmin: z.boolean(),
  invoiceSettingsId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InvoiceRole = z.infer<typeof InvoiceRoleSchema>

export default InvoiceRoleSchema;
