import { DIR_VERSION, Log, NormalizeString } from './functions/Constants'
import { Library_Sidebar } from './functions/Manifest'
import { mkdirSync, writeFileSync, cpSync, readFileSync } from 'fs'
import { compileFile } from 'pug'
import ugilfyJs from 'uglify-js'
import CleanCSS from 'clean-css'
import path from 'path'

const start = Date.now()
const minifyJs = ugilfyJs.minify
const minifyCss = (x: string) => new CleanCSS().minify(x)
const _Template = compileFile('docs/_Template.pug')

// Copy Assets
process.stdout.write('\n')
Log('build', 'Step [1/2]: Copying Assets')

cpSync('assets', 'build/assets', {
    recursive: true,
    errorOnExist: false,
    filter: function copyFilter(source: string, destination: string) {
        switch (path.extname(source)) {
            case '.js':
                // Minify Content
                const jsInput = readFileSync(source, 'utf8')
                const jsOutput = minifyJs(jsInput)
                if (jsOutput.error) throw jsOutput.error
                writeFileSync(destination, jsOutput.code)

                // Minify Results
                const sizeJsInput = Buffer.byteLength(jsInput)
                const sizeJsOutput = Buffer.byteLength(jsOutput.code)
                const compJsRatio = Math.round((sizeJsOutput / sizeJsInput) * 100)
                Log('build', `Minified ${path.basename(source).padEnd(24, ' ')} - ${sizeJsInput}b => ${sizeJsOutput}b (${compJsRatio}%)`)
                return false

            case '.css':
                const cssInput = readFileSync(source, 'utf8')
                const cssOutput = minifyCss(cssInput)
                writeFileSync(destination, cssOutput.styles)
                if (cssOutput.errors.length > 0) {
                    throw cssOutput.errors.join('\n')
                }

                // Minify Results
                const sizeCssInput = Buffer.byteLength(cssInput)
                const sizeCssOutput = Buffer.byteLength(cssOutput.styles)
                const compCssRatio = Math.round((sizeCssOutput / sizeCssInput) * 100)
                Log('build', `Minified ${path.basename(source).padEnd(24, ' ')} - ${sizeCssInput}b => ${sizeCssOutput}b (${compCssRatio}%)`)
                return false

            default:
                // Just copy it... 
                return true
        }
    },
})

// Build Documents
process.stdout.write('\n')
Log('build', 'Step [2/2]: Building Pages')

for (const { category, articles } of Library_Sidebar) {
    mkdirSync(`build/${category.id}`, { recursive: true })
    for (const article of articles) {
        if (!article.public) continue
        Log('build', `Rendered => ${category.id}/${article.id}`)
        writeFileSync(
            `build/${category.id}/${article.id}.html`,
            _Template({
                'prod': true,
                'view': `/${category.id}/${article.id}`,
                'version': DIR_VERSION,
                'sidebar': Library_Sidebar,
                'article': article,
                NormalizeString,
            })
        )
    }
}

// Redirects Page
writeFileSync('build/_redirects', '/ /library/introduction 302')
writeFileSync('build/robots.txt', 'User-agent: *\nAllow: /')

// All Done!
process.stdout.write('\n')
Log('build', `Finished in ${((Date.now() - start) / 1000).toFixed(2)}s`)