const prisma = require("../lib/prisma");

async function getConversations(req, res) {
  try {
    const userId = req.user.userId;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            type: "GLOBAL",
          },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
}

async function getMessages(req, res) {
  try {
    const conversationId = parseInt(req.params.id);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 50,
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

async function postMessages(req, res) {
  try {
    const conversationId = parseInt(req.params.id);
    const senderId = req.user.userId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content required" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversationId,
        senderId: senderId,
        content: content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

async function markRead(req, res) {
  const conversationId = parseInt(req.params.id);
  const userId = req.user.userId;

  await prisma.conversationRead.upsert({
    where: { conversationId_userId: { conversationId, userId } },
    update: { lastReadAt: new Date() },
    create: { conversationId, userId, lastReadAt: new Date() },
  });

  res.json({ ok: true });
}

// Get unread counts for all conversations this user is in
async function getUnread(req, res) {
  const userId = req.user.userId;

  const memberships = await prisma.conversationMember.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  const conversationIds = memberships.map((m) => m.conversationId);

  const reads = await prisma.conversationRead.findMany({
    where: { userId, conversationId: { in: conversationIds } },
  });

  const unreadCounts = await Promise.all(
    conversationIds.map(async (conversationId) => {
      const read = reads.find((r) => r.conversationId === conversationId);
      const count = await prisma.message.count({
        where: {
          conversationId,
          senderId: { not: userId },
          createdAt: read ? { gt: read.lastReadAt } : undefined,
        },
      });
      return { conversationId, count };
    }),
  );

  res.json(unreadCounts);
}

module.exports = {
  getConversations,
  getMessages,
  postMessages,
  markRead,
  getUnread,
};
