import { createFileRoute } from '@tanstack/react-router';
import RegisterForm from '../../components/feature/RegisterForm';

export const Route = createFileRoute('/auth/__layout/register')({
    component: RegisterForm,
});
