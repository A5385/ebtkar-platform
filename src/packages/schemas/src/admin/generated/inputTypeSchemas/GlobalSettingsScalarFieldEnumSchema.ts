import { z } from 'zod';

export const GlobalSettingsScalarFieldEnumSchema = z.enum(['id','platformName','maintenanceMode','createdAt','updatedAt']);

export default GlobalSettingsScalarFieldEnumSchema;
