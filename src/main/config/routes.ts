
import { type Express, Router } from "express";

import { feedRouter } from "@presentation/routes/feed-route";
import { likeRouter } from "@presentation/routes/like-route";
import { bookmarkRouter } from "@presentation/routes/bookmark-route";
import { commentRouter } from "@presentation/routes/comment-route";
import { userRouter } from "@presentation/routes/user-route";
import { commentReplyRouter } from "@presentation/routes/comment-route-reply";

export default (app: Express): void => {
  const router = Router();
  
  app.get("/social", (req, res) => {
    res.status(200).json({ message: "ok",});
  });

  app.use(router);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/feed", feedRouter);
  app.use("/api/v1/feed/like", likeRouter);
  app.use("/api/v1/feed/comment", commentRouter);
  app.use("/api/v1/feed/commentreply", commentReplyRouter);
  app.use("/api/v1/user/bookmark", bookmarkRouter);

};