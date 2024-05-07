import { ElementParagraph, ArticleManifest, PostElements } from './types';

const
    audioExtensions = new Set(['opus', 'mp3']),
    imageExtensions = new Set(['jpeg', 'jpg', 'png', 'webp']),
    // Global Elements
    IDLE = 0,
    COLLECT_COMMENT = 1,
    COLLECT_MANIFEST = 2,
    COLLECT_LIST = 3,
    COLLECT_TABLE = 4,
    // Paragraph Element
    COLLECT_TEXT = 5,
    COLLECT_ITALIC = 6,
    COLLECT_BOLD = 7,
    COLLECT_HINT = 8,
    COLLECT_LINK = 9,
    COLLECT_STRIKE = 10,
    COLLECT_CODE = 11

export default function MarkdownParser(someDocument: string): ArticleManifest {
    let collectedElements: Array<PostElements> = []
    let collectedManifest: ArticleManifest = {} as any
    let A = new Array()
    let S = IDLE
    let B = ''

    function parseLine(line: string): void {
        line = line.trim()

        // Collect Manifest
        if (S === IDLE && line.startsWith('```json')) {
            S = COLLECT_MANIFEST
            return
        }
        if (S === COLLECT_MANIFEST && line.startsWith('```')) {
            collectedManifest = JSON.parse(B)
            S = IDLE
            B = ''
            return
        }
        if (S === COLLECT_MANIFEST) {
            B += line
            return
        }

        // Collect Comments
        if (S === IDLE && line.startsWith('<!--')) {
            if (line.endsWith('-->')) return // Single Line Support
            S = COLLECT_COMMENT
            return
        }
        if (S === COLLECT_COMMENT && line.endsWith('-->')) {
            S = IDLE
            return
        }
        if (S === COLLECT_COMMENT) {
            // Ignore Line...
            return
        }

        // Collect List
        if (S === COLLECT_LIST && line.startsWith('- ')) {
            A.push(line.slice(2).trim())
            return
        }
        if (S === COLLECT_LIST && !line.startsWith('- ')) {
            collectedElements.push({ type: 'list', value: A })
            S = IDLE
            A = []
            return
        }
        if (S === IDLE && line.startsWith('- ')) {
            S = COLLECT_LIST
            A.push(line.slice(2).trim())
            return
        }

        // Collect Table
        if (S === COLLECT_TABLE && !line.startsWith('|') && !line.endsWith('|')) {
            if (A.length >= 2 && A[1].every((f: string) => f.split('').every(c => c === '-'))) {
                A.splice(1, 1)
                collectedElements.push({ type: 'table', value: A })
            }
            S = IDLE
            A = []
            return
        }
        if (S === COLLECT_TABLE && line.startsWith('|') && line.endsWith('|')) {
            A.push(line.split('|').map(l => l.trim()).filter(Boolean))
            return
        }
        if (S === IDLE && line.startsWith('|') && line.endsWith('|')) {
            S = COLLECT_TABLE
            A.push(line.split('|').map(l => l.trim()).filter(Boolean))
            return
        }

        // Collect Beanie Image
        if (S === IDLE && line.startsWith('%[') && line.includes('](') && line.endsWith(')')) {
            const results = (/%\[(.*)]\((.*)\)/).exec(line)
            if (!results) return
            const [_, value, href] = results
            collectedElements.push({ type: 'beanie', value, href })
            return
        }

        // Collect Banner Image
        if (S === IDLE && line.startsWith('#[') && line.includes('](') && line.endsWith(')')) {
            const results = (/#\[(.*)]\((.*)\)/).exec(line)
            if (!results) return
            const [_, value, href] = results
            collectedElements.push({ type: 'banner', value, href })
            return
        }

        // Collect Images/Audio
        if (S === IDLE && line.startsWith('![') && line.includes('](') && line.endsWith(')')) {
            const results = (/!\[(.*)]\((.*)\)/).exec(line)
            if (!results) return
            const [_, value, href] = results
            const extension = href.split('.').at(-1)?.toLowerCase()!
            if (audioExtensions.has(extension)) {
                collectedElements.push({ type: 'audio', value, href })
                return
            }
            if (imageExtensions.has(extension)) {
                collectedElements.push({ type: 'image', value, href })
                return
            }
            return
        }

        // Collect Videos
        if (line.startsWith('@[') && line.includes('](') && line.endsWith(')')) {
            const results = (/@\[(.*)]\((.*),(.*)\)/).exec(line)
            if (!results) return
            const [_, value, href, poster] = results
            collectedElements.push({ type: 'video', value, href, poster })
            return
        }

        // Collect Subheader
        if (S === IDLE && line.startsWith('##')) {
            collectedElements.push({ type: 'subheader', value: line.slice(2).trim() })
            return
        }

        // Collect Header
        if (S === IDLE && line.startsWith('#')) {
            collectedElements.push({ type: 'header', value: line.slice(1).trim() })
            return
        }

        // Collect Quote
        if (S === IDLE && line.startsWith('>')) {
            collectedElements.push({ type: 'quote', value: line.slice(1).trim() })
            return
        }

        // Collect Paragraph
        if (line.length === 0) return
        const paragraphElements = new Array<ElementParagraph['elements'][0]>()
        let Y = new Array<string>()
        let L = COLLECT_TEXT

        function FlushBuffer() {
            if (Y.length > 0) {
                paragraphElements.push({
                    type: 'text',
                    value: Y.join(' ')
                })
                Y = []
            }
        }

        line.split(' ').forEach(word => {
            word = word.trim()

            // Collect Bold Text
            if (L === COLLECT_TEXT && word.startsWith('**')) {
                FlushBuffer()
                if (word.endsWith('**')) {
                    // Collect Single
                    paragraphElements.push({
                        type: 'bold',
                        value: word.slice(2, -2)
                    })
                } else {
                    // Start Collecting
                    L = COLLECT_BOLD
                    Y = [word]
                }
                return
            }
            if (L === COLLECT_BOLD && word.endsWith('**')) {
                Y.push(word)
                paragraphElements.push({
                    type: 'bold',
                    value: Y.join(' ').slice(2, -2)
                })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Italics
            if (L === COLLECT_TEXT && word.startsWith('*')) {
                FlushBuffer()
                if (word.endsWith('*')) {
                    // Collect Single
                    paragraphElements.push({
                        type: 'italic',
                        value: word.slice(1, -1)
                    })
                } else {
                    // Start Collecting
                    L = COLLECT_ITALIC
                    Y = [word]
                }
                return
            }
            if (L === COLLECT_ITALIC && word.endsWith('*')) {
                Y.push(word)
                paragraphElements.push({
                    type: 'italic',
                    value: Y.join(' ').slice(1, -1)
                })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Code
            if (L === COLLECT_TEXT && word.startsWith('`')) {
                FlushBuffer()
                if (word.endsWith('`')) {
                    // Collect Single
                    paragraphElements.push({
                        type: 'code',
                        value: word.slice(1, -1)
                    })
                } else {
                    // Start Collecting
                    L = COLLECT_CODE
                    Y = [word]
                }
                return
            }
            if (L === COLLECT_CODE && word.endsWith('`')) {
                Y.push(word)
                paragraphElements.push({
                    type: 'code',
                    value: Y.join(' ').slice(1, -1)
                })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Hints
            if (L === COLLECT_TEXT && word.startsWith('%')) {
                FlushBuffer()
                if (word.endsWith('%')) {
                    // Collect Single
                    paragraphElements.push({
                        type: 'hint',
                        value: word.slice(1, -1)
                    })
                } else {
                    // Start Collecting
                    L = COLLECT_HINT
                    Y = [word]
                }
                return
            }
            if (L === COLLECT_HINT && word.endsWith('%')) {
                Y.push(word)
                paragraphElements.push({
                    type: 'hint',
                    value: Y.join(' ').slice(1, -1)
                })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Strikethroughs
            if (L === COLLECT_TEXT && word.startsWith('~~')) {
                FlushBuffer()
                if (word.endsWith('~~')) {
                    // Collect Single
                    paragraphElements.push({
                        type: 'strikethrough',
                        value: word.slice(2, -2)
                    })
                } else {
                    // Start Collecting
                    L = COLLECT_STRIKE
                    Y = [word]
                }
                return
            }
            if (L === COLLECT_STRIKE && word.endsWith('~~')) {
                Y.push(word)
                paragraphElements.push({
                    type: 'strikethrough',
                    value: Y.join(' ').slice(2, -2)
                })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Links
            if (L === COLLECT_TEXT && word.startsWith('[')) {
                FlushBuffer()
                L = COLLECT_LINK
                Y = [word]
                return
            }
            if (L === COLLECT_LINK && word.endsWith(')')) {
                Y.push(word)
                const results = (/\[(.*)]\((.*)\)/).exec(Y.join(' '))
                if (!results) return
                const [_, value, href] = results
                paragraphElements.push({ type: 'link', value, href })
                L = COLLECT_TEXT
                Y = []
                return
            }

            // Collect Any Word
            Y.push(word)
        })
        FlushBuffer()
        if (paragraphElements.length > 0) collectedElements.push({
            type: 'paragraph',
            elements: paragraphElements,
        })
    };

    someDocument = someDocument += '\n'
    someDocument.split('\n').forEach(parseLine)
    collectedManifest.elements = collectedElements
    return collectedManifest
}
