import { z } from 'zod';

/////////////////////////////////////////
// ROLE PERMISSION SCHEMA
/////////////////////////////////////////

export const RolePermissionSchema = z.object({
  rolePermissionId: z.string(),
  roleId: z.string(),
  permissionId: z.string(),
})

export type RolePermission = z.infer<typeof RolePermissionSchema>

export default RolePermissionSchema;
