```json
{
    "public": true,
    "id": "users",
    "layoutOrder": 300,
    "categoryId": "developers",
    "title": "Users",
    "snippet": "Developer documentation for Users"
}
```

# User Object
The following is a user and which fields are oAuth2 Scopes are required to view them. 
Optional or hidden fields are always present and will have `null` as their value instead.

| Field             | Type      | Description                    | Required oAuth2 Scope |
| ----------------- | --------- | ------------------------------ | --------------------- |
| id                | integer   | their unique account id        | identify              |
| created           | timestamp | account creation timestamp     | identify              |
| public_flags      | integer   | their public flags (badges)    | identify              |
| username          | string    | their username                 | identify              |
| displayname       | string    | their displayname              | identify              |
| biography         | string    | their biography                | identify              |
| subtitle          | string    | their subtitle (or pronouns)   | identify              |
| accent_background | integer   | their profile background color | identify              |
| accent_banner     | integer   | their profile banner color     | identify              |
| accent_border     | integer   | their profile border color     | identify              |
| avatar            | string?   | their avatar image hash        | identify              |
| banner            | string?   | their banner image hash        | identify              |
| verified          | boolean   | verified email?                | identify              |
| email             | string?   | their email address            | email                 |

> Usernames will always be alphanumeric plus underscores (A-z0-9_) and between 3-16 characters
> Usernames may change without warning, use account IDs instead!
> Displaynames and Subtitles are up to 32 characters long
> Biographies are up to 320 chracters long
> Colors are in their Decimal Representation

# Public Flags
Below are the public flags for a user, they are currently only being used for badges.
Most badges are available during a limited time or awarded on a per case basis only. 

| Value  | Name          | Description                        | Obtainable? |
| ------ | ------------- | ---------------------------------- | ----------- |
| 1 << 0 | BADGE_CROWN   | Reserved for bakonpancakz          | Never       |
| 1 << 1 | BADGE_VIP     | Reserved for important users       | No          |
| 1 << 2 | BADGE_PICROSS | Awarded by completing Challenge #1 | Yes         |

# Get Current User
`GET /users/@me`
Returns the current user if you have the `identify` scope, and email if you also have the `email` scope.

# Get User by Username  
`GET /users/<user.username>`
Returns a [user object](#user-object) for a given username, doesn't require authorization.