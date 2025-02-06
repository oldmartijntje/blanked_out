// vite.config.js
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    base: '/blanked_out/',
    build: {
        outDir: 'dist',
        emptyOutDir: true, // This will clear the output directory before building
        rollupOptions: {
            external: [], // 👈 This tells Rollup to bundle everything
        }
    },
})