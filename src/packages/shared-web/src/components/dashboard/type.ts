// sidebar.types.ts

import { ReactNode } from 'react';

export type SidebarBadge = {
    value: number | string;
};

export type SidebarLink = {
    type: 'link';

    title: string;

    url: string;

    icon?: ReactNode;

    badge?: SidebarBadge;
};

export type SidebarGroupProps = {
    type: 'group';

    title: string;

    icon?: ReactNode;

    items: SidebarLink[];
};

export type SidebarItem = SidebarLink | SidebarGroupProps;

export type AppSidebarProps = {
    title: string;

    logo?: ReactNode;

    items: SidebarItem[];
};
