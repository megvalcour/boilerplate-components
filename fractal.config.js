'use strict'

const Path = require('path')
const consolidate = require('@frctl/consolidate')
const fractal = module.exports = require('@frctl/fractal').create()
const twigAdapter = require('@frctl/twig')()
const mandelbrot = require('@frctl/mandelbrot')

const theme = mandelbrot({
    skin: 'black',
    nav: [
        'docs',
        'components',
    ],
    panels: [
        'notes',
        'html',
        'resources',
    ],
})

fractal.web.theme(theme)
fractal.components.engine(twigAdapter)
fractal.components.set('ext', '.twig')

fractal.components.set('statuses.deprecated', {
    label: 'Deprecated',
    description: 'May be removed in a future version.',
    color: '#886600',
})

fractal.set('project.title', 'Boilerplate Pattern Library')

fractal.components.set('path', Path.join(__dirname, '/resources/styles'))
fractal.docs.set('path', Path.join(__dirname, '/resources/styles/docs'))
fractal.web.set('builder.dest', Path.join(__dirname, '/web/pattern-library'))
fractal.web.set('builder.static.ignored', [
    Path.join(__dirname, '/web/pattern-library'),
    Path.join(__dirname, '/web/index.php'),
])
fractal.web.set('static.path', Path.join(__dirname, '/web'))
fractal.web.set('server.watch', true)
