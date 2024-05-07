process.env.NODE_ENV = 'development'
import { Log, DIR_ASSETS, DIR_DOCS, WEB_ADDR, WEB_PORT, DIR_VERSION, NormalizeString } from './functions/Constants'
import { Library_Articles, Library_Sidebar } from './functions/Manifest'
import express from 'express'

express()
    .disable('x-powered-by')
    .set('view engine', 'pug')
    .set('views', DIR_DOCS)
    .use('/assets', express.static(DIR_ASSETS))
    .use('/assets', (_, res) => res.status(404).end())
    .get('/', (_, res) => res.redirect('library/introduction'))
    .get('/*', (req, res, next) => {
        // @ts-ignore - its real trust me
        const somePath: string = req.params['0']
        const someArticle = Library_Articles.find(a => somePath === `${a.categoryId}/${a.id}`)
        if (!someArticle) return next()
        res.render('_Template.pug', {
            'view': `/${someArticle.categoryId}/${someArticle.id}`,
            'version': DIR_VERSION,
            'sidebar': Library_Sidebar,
            'article': someArticle,
            NormalizeString,
        })
    })
    .get('*', (_, res) => res.end('Unknown Article'))
    .listen(parseInt(WEB_PORT), WEB_ADDR, () => {
        Log('http', `Listening on ${WEB_ADDR}:${WEB_PORT}`)
        Log('http', `Serving Assets from: ${DIR_ASSETS}`)
        Log('http', `Serving Views from ${DIR_DOCS}`)
    })