import { createFileRoute } from '@tanstack/react-router';
import Layout from '../../components/page/Layout';

export const Route = createFileRoute('/auth/__layout')({
    component: Layout,
});
