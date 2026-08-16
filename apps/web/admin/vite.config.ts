import { createViteConfig } from "@repo/vite-config/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(
  createViteConfig({
    port: 7000,
    root,
  }),
);
