/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    root: import.meta.dirname,
    cacheDir: '../../../node_modules/.vite/web/admin',
    server: {
        port: 7001,
        host: 'localhost',
    },
    preview: {
        port: 7001,
        host: 'localhost',
    },
    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [],
    // },
    build: {
        outDir: './dist',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    test: {
        name: '@org/admin',
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
