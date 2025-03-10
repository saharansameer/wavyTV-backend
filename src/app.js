import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { SIZE_LIMIT } from "./constants.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SIZE_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";

// routes declaration
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/tweet", tweetRouter);
app.use("/api/comment", commentRouter);
app.use("/api/like", likeRouter);


// handle undefined routes
app.use((req, res, next) => {
  return res
    .status(404)
    .json({ status: 404, message: "oops! Route not found", success: false });
});

export default app;
