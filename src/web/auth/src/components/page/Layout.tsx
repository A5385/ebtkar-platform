import { cn } from '@org/shared-web';
import { Link, LinkOptions, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function Layout() {
    return (
        <main className='flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 md:px-[10%]'>
            <div className='grid w-full min-w-sm grid-cols-1 gap-4 rounded-xl border p-8 md:grid-cols-2 md:gap-6'>
                <div className='flex w-full flex-col items-center justify-center gap-4 md:gap-5'>
                    <TabLink url='/auth/login' title='login' />
                    <TabLink url='/auth/register' title='register' />
                </div>

                <div className='flex flex-col items-center justify-center'>
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export default Layout;

const TabLink = ({ url, title }: { url: LinkOptions['to']; title: string }) => {
    const { t } = useTranslation();

    return (
        <Link
            to={url}
            activeOptions={{ exact: true }}
            className={cn(
                'min-h-4 w-10/12 rounded-xl border px-4 py-2 shadow-md flex flex-col items-center justify-center',
            )}
            activeProps={{
                className: 'bg-black text-white',
            }}
        >
            {t(title)}
        </Link>
    );
};
