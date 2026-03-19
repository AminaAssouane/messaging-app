const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = authRouter;
