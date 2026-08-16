import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/__layout/register')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/auth/__layout/register"!</div>;
}
