import { z } from 'zod';

export const WarehousePermissionsSchema = z.enum(['BRANCH_CREATE','BRANCH_UPDATE','BRANCH_DELETE','BRANCH_ARCHIVE','BRANCH_READ','STORE_CREATE','STORE_UPDATE','STORE_DELETE','STORE_ARCHIVE','STORE_READ']);

export type WarehousePermissionsType = `${z.infer<typeof WarehousePermissionsSchema>}`

export default WarehousePermissionsSchema;
