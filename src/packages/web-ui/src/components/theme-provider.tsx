import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderState {
    resolvedTheme: Exclude<Theme, 'system'>;
    setTheme: (theme: Theme) => void;
    theme: Theme;
}

export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function getSystemTheme(): Exclude<Theme, 'system'> {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'ebtkar-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return defaultTheme;
        }

        const storedTheme = window.localStorage.getItem(storageKey);
        return storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system'
            ? storedTheme
            : defaultTheme;
    });
    const [systemTheme, setSystemTheme] = useState<Exclude<Theme, 'system'>>(() =>
        typeof window === 'undefined' ? 'light' : getSystemTheme(),
    );
    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => setSystemTheme(getSystemTheme());

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        root.style.colorScheme = resolvedTheme;
    }, [resolvedTheme]);

    const value = useMemo<ThemeProviderState>(
        () => ({
            resolvedTheme,
            setTheme: (nextTheme) => {
                window.localStorage.setItem(storageKey, nextTheme);
                setThemeState(nextTheme);
            },
            theme,
        }),
        [resolvedTheme, storageKey, theme],
    );

    return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme(): ThemeProviderState {
    const context = useContext(ThemeProviderContext);

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }

    return context;
}
