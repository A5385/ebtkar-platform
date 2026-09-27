import { DashboardLayout } from '@org/shared-web';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/__layout')({
    component: DashboardLayout,
});
