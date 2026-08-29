import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '../../components/feature/LoginForm';

export const Route = createFileRoute('/auth/__layout/login')({
    component: LoginForm,
});
