import z from 'zod';
import NetworkSettingsSchema from '../generated/modelSchema/NetworkSettingsSchema.js';

const networkSettingsSchema = NetworkSettingsSchema.omit({
    id: true,

    createdAt: true,
    updatedAt: true,
}).partial();

type NetworkSettingsFormType = z.infer<typeof networkSettingsSchema>;

export { networkSettingsSchema };
export type { NetworkSettingsFormType };
