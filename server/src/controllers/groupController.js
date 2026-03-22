const prisma = require("../lib/prisma");

async function createGroup(req, res) {
  const { name, memberIds = [] } = req.body;
  const creatorId = req.user.userId;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Group name is required" });
  }

  try {
    const group = await prisma.conversation.create({
      data: { type: "GROUP", name, ownerId: creatorId },
    });

    await prisma.conversationMember.create({
      data: { conversationId: group.id, userId: creatorId, role: "OWNER" },
    });

    const uniqueIds = [...new Set(memberIds)].filter((id) => id !== creatorId);
    if (uniqueIds.length > 0) {
      await prisma.conversationMember.createMany({
        data: uniqueIds.map((userId) => ({
          conversationId: group.id,
          userId,
          role: "MEMBER",
        })),
      });
    }

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group" });
  }
}

module.exports = { createGroup };
