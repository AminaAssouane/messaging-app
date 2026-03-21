const prisma = require("../lib/prisma");

async function getFriendRequests(req, res) {
  const userId = req.user.userId;
  try {
    const requests = prisma.friendRequest.findMany({
      where: { receiverId: userId, status: "PENDING" },
      include: { sender: { include: { id: true, username: true } } },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function sendFriendRequest(req, res) {
  const senderId = req.user.userId;
  const { username } = req.body;
  try {
    const target = await prisma.user.findUnique({ where: { username } });
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target.id === senderId)
      return res.status(400).json({ message: "Can't add yourself" });

    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId: target.id },
          { senderId: target.id, receiverId: senderId },
        ],
      },
    });
    if (existing)
      return res.status(400).json({ message: "Request already exists" });

    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: targetId,
        status: "PENDING",
      },
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function acceptFriendRequest(req, res) {}

async function rejectFriendRequest(req, res) {}

async function getFriends(req, res) {}

module.exports = { getFriendRequests, sendFriendRequest };
