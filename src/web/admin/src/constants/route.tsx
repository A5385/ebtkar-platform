import { SidebarContentProps } from '@org/shared-web';
import { Accessibility, LayoutDashboard, NetworkIcon, Settings, Users } from 'lucide-react';

export const iconProps = { size: 16, color: 'gray' };

export const routes = {
    dashboard: {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <LayoutDashboard {...iconProps} />,
        url: '/dashboard',
    },
    users: {
        id: 'users',
        title: 'Users',
        icon: <Users {...iconProps} />,
        url: '/dashboard/users',
    },

    generalSettings: {
        id: 'general',
        title: 'General',
        icon: <Settings {...iconProps} />,
        url: '/dashboard/settings/general',
    },
    networkSettings: {
        id: 'network',
        title: 'Network',
        icon: <NetworkIcon {...iconProps} />,
        url: '/dashboard/settings/network',
    },
    originSettings: {
        id: 'origin',
        title: 'Origin',
        icon: <Accessibility {...iconProps} />,
        url: '/dashboard/settings/origin',
    },
};

export const sidebarList: SidebarContentProps[] = [
    {
        type: 'button',
        ...routes.dashboard,
    },
    {
        type: 'button',
        ...routes.users,
    },
    {
        type: 'group',
        groupLabel: 'Settings',
        groupAction: 'Open Settings',
        groupIcon: <Settings {...iconProps} />,
        group: [
            { ...routes.generalSettings },
            { ...routes.networkSettings },
            { ...routes.originSettings },
        ],
    },
];
