// src\packages\shared-web\src\helpers\window-helper.ts

export const windowReady = () => (typeof window !== 'undefined' ? window : undefined);

export const getLocation = () => windowReady()?.location;

export const getPathname = () => windowReady()?.location.pathname;
