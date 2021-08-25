import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import fractal from './fractal.config.js'

export default defineConfig(async ({ command, mode }) => {
    const config = {
        plugins: [vue()],
        build: {
            manifest: true,
            outDir: 'web/assets',
            assetsDir: '.',
            rollupOptions: {
                input: 'resources/js/main.js',
            },
        },
    }

    if (command === 'serve') {
        fractal.set('viteServer', true)
        const server = fractal.web.server({ sync: true, port: 3010 })
        await server.start()

        config.server = {
            proxy: {
                '^(?!/(resources|node_modules|@vite|__vite_ping)).*': {
                    target: server.url,
                },
            },
        }
    }

    return config
})
