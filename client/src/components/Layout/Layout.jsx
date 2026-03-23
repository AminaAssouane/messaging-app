import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import ConversationList from "../ConversationList/ConversationList";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Logout from "../Logout/Logout";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import api from "../../services/api";
import styles from "./Layout.module.css";
import swan from "../../assets/icons/swan.svg";

export default function Layout() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false); // 👈 new

  const token = localStorage.getItem("token");
  const user = JSON.parse(atob(token.split(".")[1]));

  // Extract friends from existing conversations (people you already DM)
  const friends = conversations // 👈 new
    .filter((c) => c.type === "PRIVATE")
    .map((c) => c.members.find((m) => m.user.id !== user.userId)?.user)
    .filter(Boolean);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await api.get("/conversations");
        setConversations(res.data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    }
    fetchConversations();
  }, [token]);

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
        />

        {/* 👇 new */}
        <button
          className={styles.createGroupBtn}
          onClick={() => setShowCreateGroup(true)}
        >
          ＋ New Group
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
        {/* 👆 new */}

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
        }}
      />
    </div>
  );
}
