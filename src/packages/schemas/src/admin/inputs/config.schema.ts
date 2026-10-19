import z from 'zod';
import AccessSettingsSchema from '../generated/modelSchema/AccessSettingsSchema.js';
import GlobalSettingsSchema from '../generated/modelSchema/GlobalSettingsSchema.js';
import TokensConfigSchema from '../generated/modelSchema/TokensConfigSchema.js';

const globalSettingsSchema = GlobalSettingsSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).partial();
type GlobalSettingsFormType = z.infer<typeof globalSettingsSchema>;

const tokenSettingsSchema = TokensConfigSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).partial();

type TokenSettingsFormType = z.infer<typeof tokenSettingsSchema>;

const accessSettingsSchema = AccessSettingsSchema.omit({
    id: true,
    updatedAt: true,
    createdAt: true,
}).partial();

type AccessSettingsFormType = z.infer<typeof accessSettingsSchema>;

export { accessSettingsSchema, globalSettingsSchema, tokenSettingsSchema };

export type { AccessSettingsFormType, GlobalSettingsFormType, TokenSettingsFormType };
