const { Router } = require("express");
const friendRouter = Router();
const authMiddleware = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");

friendRouter.get(
  "/requests",
  authMiddleware,
  friendController.getFriendRequests,
);

friendRouter.post(
  "/request",
  authMiddleware,
  friendController.sendFriendRequest,
);

friendRouter.post(
  "/:id/accept",
  authMiddleware,
  friendController.acceptFriendRequest,
);

friendRouter.post(
  "/:id/reject",
  authMiddleware,
  friendController.rejectFriendRequest,
);

friendRouter.get("/", authMiddleware, friendController.getFriends);

module.exports = friendRouter;
