import { z } from 'zod';

export const GlobalSettingsScalarFieldEnumSchema = z.enum(['id','platformName','logo','favicon','maintenanceMode','registrationEnabled','defaultLocale','defaultTimezone','createdAt','updatedAt']);

export default GlobalSettingsScalarFieldEnumSchema;
