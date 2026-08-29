import type { ComponentProps } from 'react';
import { cn } from '../lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { ThemeSwitcher } from './theme-switcher';

export function Header({ className, ...props }: ComponentProps<'header'>) {
    return (
        <header className={cn('flex items-center justify-end gap-2 p-4 border-b', className)} {...props}>
            <LanguageSwitcher />
            <ThemeSwitcher />
        </header>
    );
}
