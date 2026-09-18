// src\packages\shared-web\src\hooks\use-location.ts
import { useRouterState } from '@tanstack/react-router';

export const useLocation = () =>
    useRouterState({
        select: (state) => state.location,
    });
