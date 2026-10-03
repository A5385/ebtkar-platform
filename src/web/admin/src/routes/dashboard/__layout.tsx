import { DashboardLayout } from '@org/shared-web';
import { createFileRoute } from '@tanstack/react-router';
import { sidebarList as items } from '../../constants/route';

export const Route = createFileRoute('/dashboard/__layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return <DashboardLayout sidebar={{ title: 'Ebtkar Admin', items }} />;
}
