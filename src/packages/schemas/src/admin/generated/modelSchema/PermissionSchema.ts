import { z } from 'zod';

/////////////////////////////////////////
// PERMISSION SCHEMA
/////////////////////////////////////////

export const PermissionSchema = z.object({
  permissionId: z.string(),
  moduleId: z.string(),
  actionId: z.string(),
  resource: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Permission = z.infer<typeof PermissionSchema>

export default PermissionSchema;
