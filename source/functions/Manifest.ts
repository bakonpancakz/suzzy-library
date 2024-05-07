import { ArticleManifest, LibraryManifest } from './types';
import { Log, DIR_DOCS } from './Constants';
import MarkdownParser from './MarkdownParser';
import path from 'path';
import fs from 'fs';

export const BUILDING = path.basename(require.main?.filename!).includes("Build")
export const Library_Manifest: LibraryManifest = require(path.join(DIR_DOCS, 'manifest.json'))
export const Library_Articles = new Array<ArticleManifest>()
export const Library_Sidebar = new Array<{
    category: LibraryManifest['categories'][0];
    articles: ArticleManifest[]
}>()

function DiscoverDirectory(somePath: string) {
    fs.readdirSync(somePath).forEach(filename => {
        const itemPath = path.join(somePath, filename)
        const metadata = fs.statSync(itemPath)

        // Recursive Scanning
        if (metadata.isDirectory()) {
            return DiscoverDirectory(itemPath)
        }

        // Parse Markdown File 
        if (filename.endsWith('md')) {
            // Parse Article
            const postContent = fs.readFileSync(itemPath, 'utf8')
            const postParsed = MarkdownParser(postContent)

            // Ensure Category Exists
            postParsed.category = Library_Manifest.categories.find(c => c.id === postParsed.categoryId)!
            if (!postParsed.category) {
                throw `Unknown category id '${postParsed.categoryId}' for article id '${postParsed.id}'`
            }

            // Add Article to Library
            Log('manifest', `Parsed => ${postParsed.categoryId}/${postParsed.id}`)
            Library_Articles.push(postParsed)
            return
        }
    })
}
DiscoverDirectory(path.join(DIR_DOCS))
Log('manifest', `Discovered ${Library_Articles.length} article(s)`)

// Generate Sidebar
for (const someCategory of Library_Manifest.categories) {
    // Collect Articles with Category
    const needsSorting = new Array<ArticleManifest>()
    for (const someArticle of Library_Articles) {
        if (someArticle.categoryId === someCategory.id) {
            if (BUILDING && !someArticle.public) continue
            needsSorting.push(someArticle)
        }
    }

    // Sort and Collect
    needsSorting.sort((a, b) => a.layoutOrder - b.layoutOrder)
    Library_Sidebar.push({
        category: someCategory,
        articles: needsSorting,
    })
}