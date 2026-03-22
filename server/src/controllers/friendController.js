const prisma = require("../lib/prisma");

async function getFriendRequests(req, res) {
  const userId = req.user.userId;
  try {
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: "PENDING" },
      include: { sender: { select: { id: true, username: true } } },
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
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });
    if (existing)
      return res.status(400).json({ message: "Request already exists" });

    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: target.id,
        status: "PENDING",
      },
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* upon accepting friend request, 
we change the status of the request to ACCEPTED, 
create a new private conversation, 
and add both users to ConversationMember */
async function acceptFriendRequest(req, res) {
  const receiverId = req.user.userId;
  const requestId = parseInt(req.params.id);
  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.receiverId !== receiverId)
      return res.status(403).json({ message: "Not allowed" });

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    const conversation = await prisma.conversation.create({
      data: { type: "PRIVATE" },
    });

    await prisma.conversationMember.createMany({
      data: [
        { conversationId: conversation.id, role: "MEMBER", userId: receiverId },
        {
          conversationId: conversation.id,
          role: "MEMBER",
          userId: request.senderId,
        },
      ],
    });

    res.json({
      message: "Friend request accepted!",
      conversationId: conversation.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function rejectFriendRequest(req, res) {
  const receiverId = req.user.userId;
  const requestId = parseInt(req.params.id);
  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.receiverId !== receiverId)
      return res.status(403).json({ message: "Not allowed" });

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
    res.json({ message: "Friend request rejected." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFriends(req, res) {
  const userId = req.user.userId;
  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });

    const friends = requests.map((r) =>
      r.senderId === userId ? r.receiver : r.sender,
    );

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
};
