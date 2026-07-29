import { createViteConfig } from '@repo/eslint-config/vite'

export default createViteConfig({
  tsconfigRootDir: import.meta.dirname,
})
