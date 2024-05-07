```json
{
    "public": false,
    "id": "example",
    "layoutOrder": -1,
    "categoryId": "library",
    "title": "Example",
    "snippet": "An example article that teaches you all about syntax"
}
```
<!-- This page should be viewed using the preview script! -->

# Syntax
This site uses a highly modified ~~and buggy~~ flavor of Markdown which shares features with the [blog system](https://suzzy.games/blog) on suzzy games.

Supported features
- Tables (without Alignment, use --- only)
- Inline Code Block (Single Tick)
- Headers (Single #)
- Subheader (Double ##)
- Quotes (Start lines with >)
- Lists (Plain text only)
- Italics (Wrapped in *)
- Bold (Wrapped in **)
- Comments
- Links 

Custom features %(see below for info on using them)%
- Embedded Metadata
- Banner Images
- Images
- Audio
- Videos
- Hints (Wrapped in %)

> Note: Resources must be placed in /assets/articles/<category>-<id>/filename.extension
> Known Bug: Trailing punctuation breaks detection

# Embedded Metadata
Articles must have a JSON code block at the beginning of the document that will be used by the manifest to build the navigation panel.
You can read what each field is for below:

| Key         | Type    | Description                                                |
| ----------- | ------- | ---------------------------------------------------------- |
| public      | Boolean | Should the article be visible in production?               |
| id          | String  | Unique Identifier for this article                         |
| categoryId  | String  | A category ID which also exists in manifest.json           |
| layoutOrder | Number  | Enforce Order of Articles in Navigation Bar                |
| title       | String  | Title of article                                           |
| snippet     | String  | Used for OG Tags serving as a description for the article. |

# Audio Preview
You can embed audio files into articles which users can download them so please have them available in high quality!

`Syntax: ![Track Title](URL to Audio with opus or mp3 extension)`

![example_audio.mp3](/assets/articles/library/example/example-audio.mp3)

> Note: Audio should be in 320kbps for MP3 and 128kbps for OPUS
> Trivia: This is a track from an upcoming game!

# Image Preview
Audio and Images use the same syntax but are automatically detected and given their appropriate element.

`Syntax: ![Image Caption](URL to Image with jpg jpeg, png, or webp extension)`

![Background from Blog Page](/assets/articles/library/example/example-image.png)

> Note: Images will take up 100% width and whatever height is required. You can use a banner image if you wish to have no outline and shadow.

# Banner Preview
Banners are the same as images but without a border, background, and shadow. 
This is just an alternative if you don't like how the default images look or are going for something else entirely.

`Syntax: #[Image Alt Text](URL to Image with any extension)`

#[Example Banner](/assets/articles/library/example/example-banner.png)

# Video Preview
Videos are unique and require a poster to be created along with the video since they aren't loaded until the user clicks on them.
They should be in `854x480px WEBM` format and have a `854x480px WEBP` poster.

`Syntax: @[Video Caption](URL to video, URL to poster)`

@[NENKI Studio Intro (Alternate Timeline)](/assets/articles/library/example/example-video.mp4,/assets/articles/library/example/example-cover.webp)

> Trivia: suzzy games were originally going to be called NENKI but decided to go with suzzy because it felt friendlier.
> Trivia: The E in the NENKI logo includes the trigram of heaven (☰) and translates into ❝the creative❞