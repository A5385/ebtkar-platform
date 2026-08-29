import { Header } from '@org/web-ui/components/header';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/__layout')({
    component: DashboardLayout,
});

function DashboardLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}
