const prisma = require("../lib/prisma");

function initSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // automatically join global chat
    socket.join(1);
    console.log(`Socket ${socket.id} joined global chat`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("send_message", (message) => {
      io.to(message.conversationId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = initSockets;
