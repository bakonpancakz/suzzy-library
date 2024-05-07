export type PostElements =
    ElementHeader |
    ElementSubheader |
    ElementQuote |
    ElementVideo |
    ElementAudio |
    ElementBeanie |
    ElementList |
    ElementCodeInline |
    ElementTable |
    ElementBanner |
    ElementImage |
    ElementParagraph

// JSON File available at manifest.json
export interface LibraryManifest {
    categories: Array<{
        id: string;             // Unique Category ID
        name: string;           // Category Name
        icon: string;           // Icon URL
    }>;
}

// {
//     "public": true,
//     "id": "example",
//     "categoryId": "library",
//     "layoutOrder": 0,
//     "title": "Example Article",
//     "snippet": "An example article used to learn all about writing articles"
// }
export interface ArticleManifest {
    public: boolean;                                // Appear in navigation bar? (All Articles are visible in preview)
    id: string;                                     // Unique Article ID for category
    categoryId: string;                             // Category ID from manifest.json
    layoutOrder: number;                            // Force Layout Order, use in increments of 100!
    title: string;                                  // Article Title
    snippet: string;                                // Article Snippet, appears in OG Tags
    category: LibraryManifest['categories'][0];     // Category Reference
    elements: Array<PostElements>;                  // Parsed Elements
}

// - List Item 1
// - List Item 2
export interface ElementList {
    type: 'list';
    value: Array<string>;
}

// | Key | Value |
// | --- | ----- |
// | My  | Table |
export interface ElementTable {
    type: 'table';
    value: Array<Array<string>>; // 2D Array 
}

// ## SubHeader
export interface ElementSubheader {
    type: 'subheader';
    value: string;
}
// # Introduction
export interface ElementHeader {
    type: 'header';
    value: string;
}

// > “I am a man of fortune, and I must seek my fortune”
export interface ElementQuote {
    type: 'quote';
    value: string;
}

// @[Video Caption](Video URL, Poster URL)
export interface ElementVideo {
    type: 'video';
    value: string;
    poster: string;
    href: string;
}

// ![Track Title](Audio URL)
export interface ElementAudio {
    type: 'audio';
    value: string;
    href: string;
}

// ![Image Caption](Image URL)
export interface ElementImage {
    type: 'image';
    value: string;
    href: string;
}

// %[Image Alt](Image URL)
export interface ElementBeanie {
    type: 'beanie';
    value: string;
    href: string;
}

// #[Alt Text](Image URL)
export interface ElementBanner {
    type: 'banner';
    value: string;
    href: string;
}

// *This* is a **paragraph** that uses all element types! %Pretty Cool Right?%
// [Click here](https://www.youtube.com/watch?v=dQw4w9WgXcQ) to watch a cool video! ~~Definitely not a rick roll~~
export interface ElementParagraph {
    type: 'paragraph';
    elements: Array<
        { type: 'text'; value: string; } |
        { type: 'bold'; value: string; } |
        { type: 'italic'; value: string; } |
        { type: 'hint'; value: string; } |
        { type: 'link'; value: string; href: string; } |
        { type: 'strikethrough'; value: string; } |
        { type: 'code'; value: string; }
    >;
}
