import { createFileRoute } from '@tanstack/react-router';
import HomePage from '../../components/page';

export const Route = createFileRoute('/dashboard/__layout/')({
    component: HomePage,
});
