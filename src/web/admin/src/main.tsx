import { RouterProvider } from '@tanstack/react-router';
import { GlobalProvider } from '@org/shared-web';
import { i18n } from '@org/shared-web';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { router } from './router';
import { NotificationSocketProvider } from './notifications/notification-socket-provider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <StrictMode>
        <GlobalProvider i18nInstance={i18n}>
            <NotificationSocketProvider>
                <RouterProvider router={router} />
            </NotificationSocketProvider>
        </GlobalProvider>
    </StrictMode>,
);
