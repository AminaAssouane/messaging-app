import { useEffect, useState } from "react";
import ConversationList from "../../components/ConversationList/ConversationList";
import MessageList from "../../components/MessageList/MessageList";
import MessageInput from "../../components/MessageInput/MessageInput";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import { getSocket, disconnectSocket } from "../../services/socket";
import api from "../../services/api";
import styles from "./Chat.module.css";
import swan from "../../assets/icons/swan.svg";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await api.get("/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const conversationsData = res.data;
        setConversations(conversationsData);

        const globalChat = conversationsData.find(
          (conv) => conv.type === "GLOBAL",
        );
        if (globalChat) {
          setSelectedConversation(globalChat);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    }
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (!selectedConversation) return;

    async function fetchMessages() {
      try {
        const res = await api.get(
          `/conversations/${selectedConversation.id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
    fetchMessages();

    // join Socket.IO room
    getSocket().emit("join_conversation", selectedConversation.id);

    // leave previous room on cleanup
    return () => {
      getSocket().emit("leave_conversation", selectedConversation.id);
    };
  }, [selectedConversation, token]);

  useEffect(() => {
    function handleReceive(message) {
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    }
    getSocket().on("receive_message", handleReceive);
    return () => getSocket().off("receive_message", handleReceive);
  }, [selectedConversation]);

  async function sendMessage(content) {
    if (!selectedConversation || !content) return;

    try {
      const res = await api.post(
        `/conversations/${selectedConversation.id}/messages`,
        {
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const message = res.data;

      getSocket().emit("send_message", message);
      /*setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });*/
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return (
    <div className={styles.chat}>
      <aside className={styles.sideBar}>
        <div className={styles.title}>
          {" "}
          <img src={swan} alt="icon" className={styles.swan} />
          <div>Swan</div>
        </div>
        <ConversationList
          conversations={conversations}
          onSelect={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
        <ThemeSwitcher className={styles.themeSwitcher} />
      </aside>
      <main className={styles.main}>
        <MessageList messages={messages} />
        <MessageInput onSend={sendMessage} />
      </main>
    </div>
  );
}
