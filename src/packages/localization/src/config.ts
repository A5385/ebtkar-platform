import i18next, { type i18n } from 'i18next';

import { resources, type SupportedLocale } from './resources.js';

export interface CreateI18nOptions {
    locale?: SupportedLocale;
    fallbackLocale?: SupportedLocale;
}

export async function createI18n({
    locale = 'en',
    fallbackLocale = 'en',
}: CreateI18nOptions = {}): Promise<i18n> {
    const instance = i18next.createInstance();

    await instance.init({
        resources,
        lng: locale,
        fallbackLng: fallbackLocale,
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,
        },
    });

    return instance;
}
