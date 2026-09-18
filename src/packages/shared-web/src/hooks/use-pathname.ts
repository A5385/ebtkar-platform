//src\packages\shared-web\src\hooks\use-pathname.ts
import { useRouterState } from '@tanstack/react-router';

export const usePathname = () =>
    useRouterState({
        select: (state) => state.location.pathname,
    });
