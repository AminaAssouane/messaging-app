require("dotenv/config");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const authRouter = require("./routes/authRouter");
const conversationRouter = require("./routes/conversationRouter");
const friendRouter = require("./routes/friendRouter");
const initSockets = require("./websocket/socket");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/conversations", conversationRouter);
app.use("/friends", friendRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(3000, (error) => {
  if (error) console.log("Error occured : ", error);
  else console.log(`Server running on port ${PORT}`);
});
