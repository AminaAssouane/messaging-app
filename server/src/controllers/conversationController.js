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
    const conversationId = Number(req.params.id);

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
    const conversationId = Number(req.params.id);
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

module.exports = { getConversations, getMessages, postMessages };
