import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// ponytail: lightningcss (default minifier) rejects a rule in Slidev's own code.css
// (checked on @slidev/cli 52.20.1 and 53.0.0). Unminified CSS until upstream fixes it.
export default defineConfig({
  build: { cssMinify: false },
  // Slidev rejects slide imports outside server.fs.allow. shared/ holds the Vue components used by site and talk.
  server: { fs: { allow: [fileURLToPath(new URL('../../shared', import.meta.url))] } },
})
