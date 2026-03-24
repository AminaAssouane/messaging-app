import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import ConversationList from "../ConversationList/ConversationList";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Logout from "../Logout/Logout";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import { getSocket } from "../../services/socket";
import api from "../../services/api";
import styles from "./Layout.module.css";
import swan from "../../assets/icons/swan.svg";

export default function Layout() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const token = localStorage.getItem("token");
  const user = JSON.parse(atob(token.split(".")[1]));

  const friends = conversations
    .filter((c) => c.type === "PRIVATE")
    .map((c) => c.members.find((m) => m.user.id !== user.userId)?.user)
    .filter(Boolean);

  // Fetch conversations + merge unread counts in one go
  useEffect(() => {
    async function fetchConversations() {
      try {
        const [convRes, unreadRes] = await Promise.all([
          api.get("/conversations"),
          api.get("/conversations/unread"),
        ]);

        const unreadMap = Object.fromEntries(
          unreadRes.data.map(({ conversationId, count }) => [
            conversationId,
            count,
          ]),
        );

        setConversations(
          convRes.data.map((c) => ({
            ...c,
            unreadCount: unreadMap[c.id] || 0,
          })),
        );
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    }
    fetchConversations();
  }, [token]);

  // Listen for presence events
  useEffect(() => {
    const socket = getSocket();

    socket.on("online_users", (userIds) => {
      setOnlineUsers(new Set(userIds));
    });
    socket.on("user_online", (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });
    socket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });
    return () => {
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sideBar}>
        <div className={styles.title}>
          <img src={swan} alt="icon" className={styles.swan} />
          <div>Swan</div>
        </div>
        <div className={styles.btnsContainer}>
          <Link to="/friends" className={styles.friendsTitle}>
            Friends
          </Link>
          <Link to="/profile" className={styles.profileTitle}>
            Profile
          </Link>
        </div>

        <ConversationList
          conversations={conversations}
          onSelect={setSelectedConversation}
          selectedConversation={selectedConversation}
          onlineUsers={onlineUsers}
          currentUserId={user.userId}
        />

        <button
          className={styles.createGroupBtn}
          onClick={() => setShowCreateGroup(true)}
        >
          ＋
        </button>

        {showCreateGroup && (
          <CreateGroupModal
            friends={friends}
            onClose={() => setShowCreateGroup(false)}
            onCreated={(newGroup) =>
              setConversations((prev) => [...prev, newGroup])
            }
          />
        )}

        <ThemeSwitcher className={styles.themeSwitcher} />
        <div className={styles.logout}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.username[0].toUpperCase()}
            </div>
            <div className={styles.username}>{user.username}</div>
          </div>
          <Logout />
        </div>
      </aside>

      <Outlet
        context={{
          conversations,
          selectedConversation,
          setSelectedConversation,
          setConversations,
        }}
      />
    </div>
  );
}
