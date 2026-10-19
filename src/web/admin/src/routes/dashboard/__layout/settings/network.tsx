import NetworkPage from '@/components/pages/network';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/__layout/settings/network')({
    component: RouteComponent,
});

function RouteComponent() {
    return <NetworkPage />;
}
