import { ChevronDown, Languages, LogOut, Moon, Sun, User2 } from 'lucide-react';
import { ReactNode } from 'react';
import { useLanguage } from '../../hooks';
import { useTheme } from '../../providers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '../ui/sidebar';

export type SidebarMenuLinkType = 'type' | 'button';
export type SidebarMenuLinkProps = {
    type: 'button';
    id: string;
    title: string;
    icon: ReactNode;
    url: string;
};

export type SidebarMenuGroup = {
    type: 'group';
    groupLabel: string;
    groupAction: string;
    groupIcon: ReactNode;
    group: Omit<SidebarMenuLinkProps, 'type'>[];
};

export type SidebarContentProps = SidebarMenuGroup | SidebarMenuLinkProps;
export type SidebarProps = {
    title?: string;
    icon?: ReactNode;
    items: SidebarContentProps[];
};

export const AppSidebar = ({ title = 'Ebt Platform', icon, items }: SidebarProps) => {
    const { open } = useSidebar();

    const { title: langTitle, changeLanguage, t, isArabic } = useLanguage();
    const { setTheme, resolvedTheme } = useTheme();
    return (
        <Sidebar
            collapsible='icon'
            variant='floating'
            className='shadow-md '
            side={isArabic ? 'right' : 'left'}
        >
            <SidebarHeader className='flex items-center justify-center gap-4'>
                {icon && icon}
                {open && <h3 className='font-bold text-lg'> {title}</h3>}
            </SidebarHeader>
            <SidebarContent className='py-4'>
                {items.map((item) => {
                    if (item.type === 'button') {
                        return (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton render={<a href={item.url} />}>
                                    {item.icon}
                                    {open && <span>{item.title}</span>}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    } else {
                        return (
                            <Collapsible className='group/collapsible'>
                                <SidebarGroup>
                                    <SidebarGroupLabel
                                        render={<CollapsibleTrigger />}
                                        className='flex items-center cursor-pointer gap-2 h-8 px-0 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    >
                                        {item.groupIcon}
                                        {open && item.groupLabel}
                                        <ChevronDown className='ml-auto transition-transform group-data-open/collapsible:rotate-180' />
                                    </SidebarGroupLabel>
                                    <CollapsibleContent>
                                        {item.group.map((subItem) => {
                                            return (
                                                <SidebarGroupContent key={subItem.id}>
                                                    <a
                                                        href={subItem.url}
                                                        className='flex items-center gap-2 ps-2 text-sm font-normal'
                                                    >
                                                        {subItem.icon}
                                                        <span>{open && subItem.title}</span>
                                                    </a>
                                                </SidebarGroupContent>
                                            );
                                        })}
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        );
                    }
                })}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<SidebarMenuButton />}>
                            <User2 /> Username
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={changeLanguage}>
                                <Languages />
                                <span>{langTitle}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    render={
                                        <button
                                            aria-label={t('theme.toggle')}

                                            className='flex items-center w-full'
                                        />
                                    }
                                >
                                    <Sun className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
                                    <Moon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
                                    {t(`theme.${resolvedTheme}`)}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent align='end'>
                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        {t('theme.light')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                                        {t('theme.dark')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('system')}>
                                        {t('theme.system')}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                <User2 />
                                <span>{t('profile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-500 bg-red-50 '>
                                <LogOut />
                                <span>{t('logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};
