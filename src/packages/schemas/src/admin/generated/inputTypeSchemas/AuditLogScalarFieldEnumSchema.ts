import { z } from 'zod';

export const AuditLogScalarFieldEnumSchema = z.enum(['auditId','userId','action','entity','oldValue','newValue','createdAt']);

export default AuditLogScalarFieldEnumSchema;
