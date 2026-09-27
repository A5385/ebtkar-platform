import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { SidebarTrigger } from '../ui/sidebar';

export function Header({ className, ...props }: ComponentProps<'header'>) {
    // const {open} = useSidebar()
    return (
        <header
            className={cn('flex items-center justify-between gap-2 p-4 border-b', className)}
            {...props}
        >
            <SidebarTrigger />
            <div className='flex items-center gap-5'>
                {/* <LanguageSwitcher />
                <ThemeSwitcher /> */}
            </div>
        </header>
    );
}
