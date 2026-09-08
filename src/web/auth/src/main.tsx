import { GlobalProvider, i18n } from '@org/shared-web';
import '@org/shared-web/styles';
import { RouterProvider } from '@tanstack/react-router';
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
