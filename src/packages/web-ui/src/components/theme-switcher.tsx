import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme } from './theme-provider';

export function ThemeSwitcher() {
    const { setTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button aria-label={t('theme.toggle')} size='icon' variant='outline' />}
            >
                <Sun className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
                <Moon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    {t('theme.light')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    {t('theme.dark')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    {t('theme.system')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
