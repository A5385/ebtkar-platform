import { createFileRoute } from '@tanstack/react-router';
import OriginPage from '../../components/pages/origin';

export const Route = createFileRoute('/dashboard/__layout/settings/origin')({
    component: RouteComponent,
});

function RouteComponent() {
    return <OriginPage />;
}
