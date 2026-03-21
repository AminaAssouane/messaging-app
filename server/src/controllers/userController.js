const prisma = require("../lib/prisma");

async function searchUser(req, res) {
  const username = req.query;
  if (!username) return res.json([]);
  try {
    const users = await prisma.user.findMany({
      where: {
        username: { contains: username, mode: "insensitive" },
        NOT: { id: req.user.userId },
      },
      select: { id: true, username: true },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed searching for users" });
  }
}

module.exports = { searchUser };
