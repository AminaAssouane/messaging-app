import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MessageList from "../../components/MessageList/MessageList";
import MessageInput from "../../components/MessageInput/MessageInput";
import { getSocket, disconnectSocket } from "../../services/socket";
import api from "../../services/api";
import styles from "./Chat.module.css";
import { UserRound, UsersRound } from "lucide-react";

export default function Chat() {
  const { conversations, selectedConversation, setSelectedConversation } =
    useOutletContext();
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!conversations.length) return;
    const globalChat = conversations.find((conv) => conv.type === "GLOBAL");
    if (globalChat && !selectedConversation) {
      setSelectedConversation(globalChat);
    }
  }, [conversations]);

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

    getSocket().emit("join_conversation", selectedConversation.id);
    return () =>
      getSocket().emit("leave_conversation", selectedConversation.id);
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
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      getSocket().emit("send_message", res.data);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <div className={styles.avatar}>
          {selectedConversation?.type === "PRIVATE" ? (
            <UserRound className={styles.icon} />
          ) : (
            <UsersRound className={styles.icon} />
          )}
        </div>
        <div className={styles.name}>
          {selectedConversation?.name || "Private Chat"}
        </div>
      </div>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </main>
  );
}
