const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    plugins: [
        purgecss({
            content: [
                './resources/styles/**/*.twig',
                './web/pattern-library/components/render/**/*.html',
            ],
        }),
    ],
}
