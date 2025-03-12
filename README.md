# wavyTV Backend (JS-v0)

A Node.js-powered backend for a video streaming platform, providing essential features like user authentication, video uploads, playlists, comments, likes, and subscriptions. The project follows a structured approach with controllers handling logic, models managing data, middlewares ensuring smooth processing, and routes defining API endpoints. 

The backend is deployed and available at: **[wavytv-backend-js.vercel.app](https://wavytv-backend-js.vercel.app)**

## Tech Stack

This project is built using the following technologies:

- **[Node.js](https://nodejs.org/en)** - JavaScript runtime for backend development  
- **[Express.js](https://expressjs.com/)** - Web framework for handling routes and middleware  
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for storing user and video data  
- **[Cloudinary](https://cloudinary.com/)** - Media storage and management for video uploads  
- **[JWT (JSON Web Tokens)](https://jwt.io/)** - Authentication and authorization mechanism  


## Notable Directories and Files

- **src/controllers**: Functions handling incoming requests and preparing responses.
- **src/models**: Database schemas and methods for different entities.
- **src/routes**: Express route definitions.
- **src/middlewares**: Reusable functions that run before controllers (e.g., error handling, logging).
- **src/utils**: Utilities for handling API response and error, and Cloudinary integration.
- **src/db/db.js**: Database connection logic.
- **app.js**: Initializes the Express app, routes and middleware.
- **index.js**: Main application entry point.


## API Endpoints

### Auth
-   `POST /api/auth/signup` - Create a new user
-   `POST /api/auth/login` - Login a user
-   `POST /api/auth/logout` - Logout user
-   `POST /api/auth/token` - Generate new access token


### User
-   `GET /api/user` - Get current user details
-   `PATCH /api/user` - Update current user details (i.e fullName, username, password)

-   `GET /api/user/channel/:username` - Get user channel details
-   `PATCH /api/user/channel/:username` - Update user channel details (i.e avatar, coverImage)

-   `PATCH /api/user/security` - Change password
-   `GET /api/user/history` - Get user watch history


### Video
-   `GET /api/video` - Get all videos
-   `POST /api/video` - Upload a video

-   `GET /api/video/:videoId` - Get a video by id
-   `POST /api/video/:videoId` - Update video details (i.e title, description, thumbnail)
-   `DELETE /api/video/:videoId` - Delete video and its related data
-   `PATCH /api/video/:videoId` - Toggle video publish status (i.e public or private)


### Tweet
-   `POST /api/tweet` - Create a new tweet
-   `GET /api/tweet/:tweetId` - Get a tweet by id
-   `PATCH /api/tweet/:tweetId` - Update a tweet
-   `DELETE /api/tweet/:tweetId` - Delete a tweet

-   `GET /api/tweet/user/:username` - Get all tweets by a user


### Playlist
-   `GET /api/playlist` - Get all playlists created by a user
-   `POST /api/playlist` - Create playlist

-   `PATCH /api/playlist/:playlistId` - Update playlist details (i.e title, description)
-   `DELETE /api/playlist/:playlistId` - Delete a playlist

-   `POST /api/playlist/video` - Add a video to playlist
-   `GET /api/playlist/video` - Remove a video from playlist


### Subscription
-   `GET /api/subscription` - Get channels which are subscribed by user
-   `GET /api/subscription/subscribers` - Get details of all subscribers of channel
-   `POST /api/subscription/:channelId` - Toggle channel subscription (i.e subscribe and unsubscribe)


### Comment
-   `GET /api/comment/video/:videoId` - Get a video's comments
-   `POST /api/comment/video/:videoId` - Add comment on video

-   `GET /api/comment/tweet/:tweetId` - Get a tweet's comments
-   `POST /api/comment/tweet/:tweetId` - Add comment on tweet

-   `PATCH /api/comment/:commendId` - Update a comment
-   `DELETE /api/comment/:commendId` - Delete a comment


### Like
-   `GET /api/like/video` - Get videos which are liked by user
-   `POST /api/like/video/:videoId` - Toggle video like
-   `POST /api/like/tweet/:tweetId` - Toggle tweet like
-   `POST /api/like/comment/:commentId` - Toggle comment like

---

## Connect & Learn

For any feedback or suggestions, feel free to reach out to me on [`X/Twitter`](https://x.com/sameersaharanx)

Also checkout this amazing [Backend Playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW) by [@hiteshchoudhary](https://github.com/hiteshchoudhary). I’ve learned a lot about backend development from this playlist.