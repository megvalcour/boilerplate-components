import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3010,
        strictPort: true
    },
    build: {
        manifest: true,
        rollupOptions: {
            input: 'resources/js/main.js',
        },
    },
})
