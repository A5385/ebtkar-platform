import baseConfig from '@repo/prettier-config';

/**
 * @type {
 *   import('prettier').Config &
 *   import('prettier-plugin-tailwindcss').PluginOptions
 * }
 */
export default {
    ...baseConfig,
    tailwindStylesheet: '@repo/web-ui/globals.css',
};
