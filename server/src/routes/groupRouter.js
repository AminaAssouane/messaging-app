const { Router } = require("express");
const groupRouter = Router();
const authMiddleware = require("../middleware/authMiddleware");
const groupController = require("../controllers/groupController");

groupRouter.post("/", authMiddleware, groupController.createGroup);
groupRouter.post("/:id/invite", authMiddleware, groupController.inviteMember);
groupRouter.get("/:id/members", authMiddleware, groupController.getMembers);
groupRouter.delete(
  "/:id/members/:userId",
  authMiddleware,
  groupController.removeMember,
);

module.exports = groupRouter;
