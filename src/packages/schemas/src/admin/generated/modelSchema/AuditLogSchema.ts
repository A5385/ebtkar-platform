import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema.js'

/////////////////////////////////////////
// AUDIT LOG SCHEMA
/////////////////////////////////////////

export const AuditLogSchema = z.object({
  auditId: z.string(),
  userId: z.string().nullable(),
  action: z.string(),
  entity: z.string(),
  oldValue: JsonValueSchema.nullable(),
  newValue: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
})

export type AuditLog = z.infer<typeof AuditLogSchema>

export default AuditLogSchema;
