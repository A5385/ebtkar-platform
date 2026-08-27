import ar from './locales/ar.json' with { type: 'json' };
import en from './locales/en.json' with { type: 'json' };

export const resources = {
    en: {
        translation: en,
    },
    ar: {
        translation: ar,
    },
} as const;

export type SupportedLocale = keyof typeof resources;

export const supportedLocales = Object.keys(resources) as SupportedLocale[];
