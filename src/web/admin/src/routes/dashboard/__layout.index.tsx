import { createFileRoute } from '@tanstack/react-router';
import Page from '../../components/page';

export const Route = createFileRoute('/dashboard/__layout/')({
    component: Page,
});
