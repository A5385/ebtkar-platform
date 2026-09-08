import { createI18n, supportedLocales, type SupportedLocale } from '@org/localization';

const languageStorageKey = 'ebtkar-language';

function getInitialLocale(): SupportedLocale {
    if (typeof window === 'undefined') {
        return 'en';
    }

    const storedLocale = window.localStorage.getItem(languageStorageKey);

    if (supportedLocales.includes(storedLocale as SupportedLocale)) {
        return storedLocale as SupportedLocale;
    }

    const browserLocale = window.navigator.language.split('-')[0] as SupportedLocale;
    return supportedLocales.includes(browserLocale) ? browserLocale : 'en';
}

export const i18n = await createI18n({ locale: getInitialLocale() });

i18n.on('languageChanged', (locale) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(languageStorageKey, locale);
    }
});
