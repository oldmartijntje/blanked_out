// vite.config.js
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    optimizeDeps: {
        include: ["mqtt"],
    },
    base: '/blanked_out/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                format: "es",
            },
        }
    },
})