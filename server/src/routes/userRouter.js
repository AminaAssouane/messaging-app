const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

userRouter.get("/search", authMiddleware, userController.searchUser);

module.exports = userRouter;
