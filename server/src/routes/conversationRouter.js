const { Router } = require("express");
const conversationRouter = Router();
const conversationController = require("../controllers/conversationController.js");
const authMiddleware = require("../middleware/authMiddleware");

conversationRouter.get(
  "/",
  authMiddleware,
  conversationController.getConversations,
);
conversationRouter.get(
  "/:id/messages",
  authMiddleware,
  conversationController.getMessages,
);
conversationRouter.post(
  "/:id/messages",
  authMiddleware,
  conversationController.postMessages,
);

module.exports = conversationRouter;
