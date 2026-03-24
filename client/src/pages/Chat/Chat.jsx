import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import MessageList from "../../components/MessageList/MessageList";
import MessageInput from "../../components/MessageInput/MessageInput";
import InviteMemberModal from "../../components/InviteMemberModal/InviteMemberModal";
import { getSocket, disconnectSocket } from "../../services/socket";
import api from "../../services/api";
import styles from "./Chat.module.css";
import { UserRound, UsersRound, UserPlus } from "lucide-react";

export default function Chat() {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    setConversations,
  } = useOutletContext();

  const [messages, setMessages] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimers = useRef({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(atob(token.split(".")[1]));

  const friends = conversations
    .filter((c) => c.type === "PRIVATE")
    .map((c) => c.members.find((m) => m.user.id !== user.userId)?.user)
    .filter(Boolean);

  // Default to global chat
  useEffect(() => {
    if (!conversations.length) return;
    const globalChat = conversations.find((conv) => conv.type === "GLOBAL");
    if (globalChat && !selectedConversation) {
      setSelectedConversation(globalChat);
    }
  }, [conversations]);

  // Fetch messages + mark as read when switching conversations
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

    async function markAsRead() {
      try {
        await api.post(
          `/conversations/${selectedConversation.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // Clear badge immediately without waiting for a refetch
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c,
          ),
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }

    fetchMessages();
    markAsRead();

    getSocket().emit("join_conversation", selectedConversation.id);
    return () =>
      getSocket().emit("leave_conversation", selectedConversation.id);
  }, [selectedConversation, token]);

  // Receive messages: if it's for another conversation, bump its badge
  useEffect(() => {
    async function handleReceive(message) {
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
        // We're already looking at it, so mark as read silently
        await api.post(
          `/conversations/${message.conversationId}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === message.conversationId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c,
          ),
        );
      }
    }
    getSocket().on("receive_message", handleReceive);
    return () => getSocket().off("receive_message", handleReceive);
  }, [selectedConversation]);

  // Typing indicator: auto-clears after 3 seconds of silence
  useEffect(() => {
    function handleTyping({ userId, conversationId }) {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: userId }));
      if (typingTimers.current[conversationId]) {
        clearTimeout(typingTimers.current[conversationId]);
      }
      typingTimers.current[conversationId] = setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [conversationId]: null }));
      }, 3000);
    }
    getSocket().on("user_typing", handleTyping);
    return () => getSocket().off("user_typing", handleTyping);
  }, []);

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

  function handleTyping() {
    if (!selectedConversation) return;
    getSocket().emit("typing", { conversationId: selectedConversation.id });
  }

  // Resolve who is typing in the current conversation to a username
  const typingUserId = typingUsers[selectedConversation?.id];
  const typingUserName = typingUserId
    ? conversations
        .flatMap((c) => c.members)
        .find((m) => m.user.id === typingUserId)?.user.username
    : null;

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

        {selectedConversation?.type === "GROUP" && (
          <UserPlus
            className={styles.inviteBtn}
            onClick={() => setShowInvite(true)}
          />
        )}
      </div>

      <MessageList messages={messages} currentUserId={user.userId} />
      <div className={styles.typingIndicator}>
        {typingUserName && `${typingUserName} is typing...`}
      </div>
      <MessageInput onSend={sendMessage} onTyping={handleTyping} />

      {showInvite && (
        <InviteMemberModal
          groupId={selectedConversation.id}
          friends={friends}
          onClose={() => setShowInvite(false)}
        />
      )}
    </main>
  );
}
