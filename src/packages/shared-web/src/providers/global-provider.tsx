import type { LocalizationInstance, SupportedLocale } from '@org/localization';
import type { QueryClient } from '@org/query-client';
import type { ReactNode } from 'react';

import { Toaster } from '../components/ui/toast';
import { DialogProvider } from './dialog-provider';
import { LocalizationProvider, type LocalizationProviderProps } from './localization-provider';
import { QueryProvider } from './query-provider';
import { SheetProvider } from './sheet-provider';
import { ThemeProvider, type Theme, type ThemeProviderProps } from './theme-provider';

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
                    <SheetProvider>
                        <DialogProvider>
                            <Toaster>{children}</Toaster>
                        </DialogProvider>
                    </SheetProvider>
                </QueryProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
