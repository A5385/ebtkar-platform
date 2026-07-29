import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/__layout/login')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/auth/__layout/login"!</div>;
}
