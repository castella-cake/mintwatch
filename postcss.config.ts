import postcssNested from 'postcss-nested'
import postcssScss from 'postcss-scss'
import postcssMinify from '@csstools/postcss-minify'

export default {
    parser: postcssScss,
    plugins: [
        postcssNested,
        postcssMinify,
    ]
}