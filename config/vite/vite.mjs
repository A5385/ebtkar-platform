import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const headers = {
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none';",
};

/**
 * @param {{
 *   port: number;
 *   host?: string;
 *   root: string;
 * }} options
 */
export function createViteConfig({ port, host = "0.0.0.0", root }) {
  return {
    server: {
      host,
      port,
      headers,
    },

    preview: {
      headers,
    },

    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),

      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),

      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
      },
    },
  };
}
