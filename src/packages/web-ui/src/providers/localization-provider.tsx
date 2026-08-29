import { createI18n, type LocalizationInstance, type SupportedLocale } from '@org/localization';
import { type ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

export interface LocalizationProviderProps {
    children: ReactNode;
    fallbackLocale?: SupportedLocale;
    i18nInstance?: LocalizationInstance;
    locale?: SupportedLocale;
}

function updateDocumentLanguage(instance: LocalizationInstance): void {
    const locale = instance.resolvedLanguage ?? instance.language;
    const root = window.document.documentElement;

    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

export function LocalizationProvider({
    children,
    fallbackLocale = 'en',
    i18nInstance,
    locale = 'en',
}: LocalizationProviderProps) {
    const [instance, setInstance] = useState<LocalizationInstance | null>(i18nInstance ?? null);

    useEffect(() => {
        let active = true;

        if (i18nInstance) {
            setInstance(i18nInstance);
            return;
        }

        void createI18n({ fallbackLocale, locale }).then((createdInstance) => {
            if (active) {
                setInstance(createdInstance);
            }
        });

        return () => {
            active = false;
        };
    }, [fallbackLocale, i18nInstance, locale]);

    useEffect(() => {
        if (!instance) {
            return;
        }

        const handleLanguageChange = () => updateDocumentLanguage(instance);
        handleLanguageChange();
        instance.on('languageChanged', handleLanguageChange);

        return () => instance.off('languageChanged', handleLanguageChange);
    }, [instance]);

    if (!instance) {
        return null;
    }

    return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
