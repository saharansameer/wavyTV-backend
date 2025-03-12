import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  return res.status(200).json({
    message:
      "A Node.js-powered backend for a video streaming platform, providing essential features like user authentication, video uploads, playlists, comments, likes, and subscriptions. The project follows a structured approach with controllers handling logic, models managing data, middlewares ensuring smooth processing, and routes defining API endpoints.",
    github: "https://github.com/saharansameer/wavyTV-backend-js",
    server: "https://wavytv-backend-js.vercel.app"
  });
});

router.route("/api").get((req, res) => {
  return res.status(200).json({
    message:
      "All available API endpoints categorized by functionality and request type.",
    routes: {
      auth: [
        "POST /api/auth/signup",
        "POST /api/auth/login",
        "POST /api/auth/logout",
        "POST /api/auth/token"
      ],
      user: [
        "GET /api/user",
        "PATCH /api/user",
        "GET /api/user/channel/:username",
        "PATCH /api/user/channel/:username",
        "PATCH /api/user/security",
        "GET /api/user/history"
      ],
      video: [
        "GET /api/video",
        "POST /api/video",
        "GET /api/video/:videoId",
        "POST /api/video/:videoId",
        "DELETE /api/video/:videoId",
        "PATCH /api/video/:videoId"
      ],
      tweet: [
        "POST /api/tweet",
        "GET /api/tweet/:tweetId",
        "PATCH /api/tweet/:tweetId",
        "DELETE /api/tweet/:tweetId",
        "GET /api/tweet/user/:username"
      ],
      playlist: [
        "GET /api/playlist",
        "POST /api/playlist",
        "PATCH /api/playlist/:playlistId",
        "DELETE /api/playlist/:playlistId",
        "POST /api/playlist/video",
        "GET /api/playlist/video"
      ],
      subscription: [
        "GET /api/subscription",
        "GET /api/subscription/subscribers",
        "POST /api/subscription/:channelId"
      ],
      comment: [
        "GET /api/comment/video/:videoId",
        "POST /api/comment/video/:videoId",
        "GET /api/comment/tweet/:tweetId",
        "POST /api/comment/tweet/:tweetId",
        "PATCH /api/comment/:commendId",
        "DELETE /api/comment/:commendId"
      ],
      like: [
        "GET /api/like/video",
        "POST /api/like/video/:videoId",
        "POST /api/like/tweet/:tweetId",
        "POST /api/like/comment/:commentId"
      ]
    }
  });
});

export default router;
