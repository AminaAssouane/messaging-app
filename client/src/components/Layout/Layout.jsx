import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ConversationList from "../ConversationList/ConversationList";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Logout from "../Logout/Logout";
import api from "../../services/api";
import styles from "./Layout.module.css";
import swan from "../../assets/icons/swan.svg";

export default function Layout() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(atob(token.split(".")[1]));

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await api.get("/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        <ConversationList
          conversations={conversations}
          onSelect={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
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
