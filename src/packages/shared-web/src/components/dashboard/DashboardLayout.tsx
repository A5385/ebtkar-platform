import { Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '../ui/sidebar';
import { Header } from './header';
import { AppSidebar } from './Sidebar';

export const DashboardLayout = () => {
    return (
        <SidebarProvider className='h-screen overflow-hidden'>
            <AppSidebar />

            <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
                {/* fixed height */}
                <Header />

                {/* remaining height */}
                <div className='flex min-h-0 flex-1 overflow-hidden bg-sidebar p-4'>
                    <main
                        className='
                            min-h-0
                            flex-1
                            overflow-auto
                            scroll-fade-b
                            rounded-xl
                            bg-background
                            p-4
                            text-foreground
                        '
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};
