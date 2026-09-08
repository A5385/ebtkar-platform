import type { QueryClient } from '@org/query-client';
import type { ReactNode } from 'react';
import type { LocalizationInstance, SupportedLocale } from '@org/localization';
import { ThemeProvider, type Theme, type ThemeProviderProps } from './theme-provider';
import { LocalizationProvider, type LocalizationProviderProps } from './localization-provider';
import { QueryProvider } from './query-provider';
import { Toaster } from '../components/ui/toast';

export interface GlobalProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    fallbackLocale?: SupportedLocale;
    i18nInstance?: LocalizationInstance;
    locale?: SupportedLocale;
    queryClient?: QueryClient;
    themeStorageKey?: string;
}

export function GlobalProvider({
    children,
    defaultTheme,
    fallbackLocale,
    i18nInstance,
    locale,
    queryClient,
    themeStorageKey,
}: GlobalProviderProps) {
    const themeProps: Omit<ThemeProviderProps, 'children'> = {
        defaultTheme,
        storageKey: themeStorageKey,
    };
    const localizationProps: Omit<LocalizationProviderProps, 'children'> = {
        fallbackLocale,
        i18nInstance,
        locale,
    };

    return (
        <ThemeProvider {...themeProps}>
            <LocalizationProvider {...localizationProps}>
                <QueryProvider client={queryClient}>
                    <Toaster>{children}</Toaster>
                </QueryProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
