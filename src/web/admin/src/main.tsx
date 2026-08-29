import { RouterProvider } from '@tanstack/react-router';
import { GlobalProvider } from '@org/web-ui/providers/global-provider';
import { i18n } from '@org/web-ui/i18n';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { router } from './router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <StrictMode>
        <GlobalProvider i18nInstance={i18n}>
            <RouterProvider router={router} />
        </GlobalProvider>
    </StrictMode>,
);
