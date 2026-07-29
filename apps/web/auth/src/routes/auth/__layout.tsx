import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/__layout')({
    component: RouteComponent,
});

function RouteComponent() {
    const list = [
        { title: 'Login', url: '/auth/login' },
        { title: 'Register', url: '/auth/login' },
        { title: 'New Password', url: '/auth/new-password' },
        { title: 'Verify Email', url: '/auth/verify-email' },
    ];
    return (
        <div className='flex flex-col justify-center items-center w-full h-screen overflow-hidden bg-linear-30 from-blue-200 to-purple-200'>
            <div className='flex items-center gap-4 mb-8'>
                {list.map((li) => (
                    <Link to={li.url} key={li.title} className='font-bold'>
                        {li.title}
                    </Link>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
