const { Router } = require("express");
const conversationRouter = Router();
const conversationController = require("../controllers/conversationController.js");

conversationRouter.get("/", conversationController.getConversations);
conversationRouter.get("/:id/messages", conversationController.getMessages);
conversationRouter.post("/:id/messages", conversationController.postMessages);

module.exports = conversationRouter;
