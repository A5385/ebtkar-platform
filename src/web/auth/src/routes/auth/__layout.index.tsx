import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/__layout/')({
    beforeLoad: () => {
        throw redirect({ to: '/auth/login' });
    },
});
