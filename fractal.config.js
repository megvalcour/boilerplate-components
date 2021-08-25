const resolve = require('path').resolve
const fractal = module.exports = require('@frctl/fractal').create()
const mandelbrot = require('@frctl/mandelbrot')
const theme = require('fractal-theme-hydrogen')(mandelbrot)
const fractalTwig = require('@frctl/twig')

/**
 * Use vite-manifest to provide the twig function viteManifest for referencing
 * assets compiled by vite.
 */
import('vite-manifest').then(({ default: viteManifest }) => {
    viteManifest = viteManifest(resolve('./web/assets/manifest.json'))
    fractal.components.engine(
        fractalTwig({ functions: { viteManifest } })
    )
})

/**
 * Name your Pattern Library!
 */
fractal.set('project.title', 'Pattern Library')

/**
 * Use Twig instead of Handlebars.
 */
fractal.components.set('ext', '.twig')

/**
 * Use Hydrogen, a cleaner Fractal theme.
 */
fractal.web.theme(theme)

/**
 * An additional status for deprecated components.
 */
fractal.components.set('statuses.deprecated', {
    label: 'Deprecated',
    description: 'May be removed in a future version.',
    color: '#874',
})

/**
 * Components are in /resources/styles.
 */
fractal.components.set('path', resolve('./resources/styles'))

/**
 * Docs are in /resources/styles/docs.
 */
fractal.docs.set('path', resolve('./resources/styles/docs'))

/**
 * Build the pattern library (`fractal build`) in /web/pattern-library.
 */
fractal.web.set('builder.dest', resolve('./web/pattern-library'))

/**
 * Static files the pattern library uses are copied from /web, but make sure
 * not to copy index.php or the pattern library itself.
 */
fractal.web.set('static.path', resolve('/web'))
fractal.web.set('builder.static.ignored', [
    resolve('./web/pattern-library'),
    resolve('./web/index.php'),
])

/**
 * Use BrowserSync when you run `fractal start`. Don't rebuild when .scss files
 * change; wait until the CSS changes.
 */
fractal.web.set('server.sync', true)
fractal.web.set('server.syncOptions', { watchOptions: { ignored: /\.scss$/i } });

/**
 * Instead of using BrowserSync above, you can use server.watch as a
 * lightweight server that will rebuild on changes but won't hot reload.
 */
// fractal.web.set('server.watch', true)
