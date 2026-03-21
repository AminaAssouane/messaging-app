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

async function sendFriendRequest(req, res) {}

async function acceptFriendRequest(req, res) {}

async function rejectFriendRequest(req, res) {}

async function getFriends(req, res) {}

module.exports = { getFriendRequests };
