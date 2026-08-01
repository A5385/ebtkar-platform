import { nestJsConfig } from '@repo/eslint-config/nest';

/** @type {import("eslint").Linter.Config} */
export default [
    ...nestJsConfig,
    {
        ignores: ['.prettier.config.mjs', 'eslint.config.mjs'],
    },
];
