const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const onlineUsers = new Map();
const GLOBAL_CONVERSATION_ID = 1;

function initSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`User ${userId} connected (socket ${socket.id})`);

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    io.emit("user_online", userId);

    socket.emit("online_users", [...onlineUsers.keys()]);

    // automatically join global chat
    socket.join(GLOBAL_CONVERSATION_ID);
    console.log(`Socket ${socket.id} joined global chat`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on("send_message", (message) => {
      io.to(message.conversationId).emit("receive_message", message);
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(conversationId).emit("user_typing", { userId, conversationId });
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit("user_offline", userId);
        }
      }
      console.log(`User ${userId} disconnected`);
    });
  });
}

module.exports = initSockets;
