/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    root: import.meta.dirname,
    envDir: '../../..',
    envPrefix: ['VITE_', 'API_GATEWAY_'],
    cacheDir: '../../../node_modules/.vite/web/auth',

    server: {
        port: 7000,
        host: 'localhost',
    },

    preview: {
        port: 7000,
        host: 'localhost',
    },

    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), tailwindcss(), react()],

    build: {
        outDir: './dist',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },

    test: {
        name: '@org/auth',
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: './test-output/vitest/coverage',
            provider: 'v8' as const,
        },
    },
}));
