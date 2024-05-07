```json
{
    "public": true,
    "id": "reference",
    "layoutOrder": 100,
    "categoryId": "developers",
    "title": "Reference",
    "snippet": "References for suzzy APIs and Services"
}
```
# Making Requests
All Requests should be made to the following URL:
`https://suzzy.games/api`

## Ratelimiting
Each API response include headers related to ratelimiting, please follow them otherwise the server will automatically reject it with a `429 Too Many Requests` error.

| Header              | Description                      |
| ------------------- | -------------------------------- |
| RateLimit-Limit     | Request Quota                    |
| RateLimit-Remaining | Requests Remaining               |
| RateLimit-Reset     | Float seconds until Quota Resets |

> Sending too many bad requests too quickly will result in your IP Address being blocked temporarily.

# Content URLs
User-generated content and certain site resources are available using the following base URL and paths:
`https://content.suzzy.games/`

| Name        | Path |
| ----------- | ---- |
| User Avatar       | /avatars/<user.id>/<user.avatar>.<extension> |
| User Banner       | /banners/<user.id>/<user.banner>.<extension> |

> User Avatars and Banners are MD5 Hashes of the Image

## Default Assets
In the case a user doesn't have a custom avatar you can use a default one by calculating the index with `user.id % 6` and using the following URL:
`https://suzzy.games/assets/images/user-default{index}.png`

Defaults Colors for Profiles are as follows:
- Background: #333550
- Banner: #1D1E2E
- Border: #282A3F

## Image Service: Extensions
Following extensions, their corresponding type, and if they can used for animated images.

| MIME Type  | Extension   | Animated? |
| ---------- | ----------- | --------- |
| image/jpeg | .jpg, .jpeg | ❌         |
| image/png  | .png        | ❌         |
| image/webp | .webp       | ❌         |
| image/gif  | .gif        | ✅         |

## Image Service: Animated
Users may sometimes upload animated Avatars and Banners for use on their profiles.

You can request the animated version of an image if their image hash starts with `a_` and by using the `.gif` extension.

> Note: Requesting a non-animated image in an animated format will result in a 400 Bad Request

## Image Service: Resizing
You can specify an image size using the query parameter `size` and one of the following integer values
- 32px (Tiny)
- 64px (Small)
- 128px (Medium)
- 256px (Large, Default)
- 512px (Extra Large)