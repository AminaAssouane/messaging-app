const prisma = require("../lib/prisma");

async function requireRole(conversationId, userId, ...roles) {
  const member = await prisma.conversationMember.findFirst({
    where: { conversationId, userId },
  });
  if (!member || !roles.includes(member.role)) return null;
  return member;
}

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

async function inviteMember(req, res) {
  const conversationId = req.params.id;
  const { userId: invitedUserId } = req.body;
  const requesterId = req.user.userId;

  try {
    const requester = await requireRole(
      conversationId,
      requesterId,
      "OWNER",
      "ADMIN",
    );
    if (!requester) return res.status(403).json({ error: "Not authorized" });

    const existing = await prisma.conversationMember.findFirst({
      where: { conversationId, userId: invitedUserId },
    });
    if (existing)
      return res.status(400).json({ error: "User is already a member" });

    const newMember = await prisma.conversationMember.create({
      data: { conversationId, userId: invitedUserId, role: "MEMBER" },
    });

    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to invite member" });
  }
}

module.exports = { createGroup, inviteMember };
