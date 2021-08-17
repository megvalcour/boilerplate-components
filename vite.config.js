import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '^(?!/(resources|node_modules|@vite|__vite_ping)).*': {
                target: 'http://localhost:3010',
            },
        },
    },
    build: {
        manifest: true,
        rollupOptions: {
            input: 'resources/js/main.js',
        },
    },
})
