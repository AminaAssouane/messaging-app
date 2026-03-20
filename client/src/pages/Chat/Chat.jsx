import { useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import socket from "../services/socket";
import api from "../services/api";

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
        setConversations(res.data);
        if (res.data.length > 0) setSelectedConversation(res.data[0]);
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
    socket.emit("join_conversation", selectedConversation.id);

    // leave previous room on cleanup
    return () => {
      socket.emit("leave_conversation", selectedConversation.id);
    };
  }, [selectedConversation, token]);

  useEffect(() => {
    function handleReceive(message) {
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    }
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [selectedConversation]);

  function sendMessage(content) {
    if (!selectedConversation || !content) return;

    socket.emit("send_message", {
      conversationId: selectedConversation.id,
      content,
    });
  }

  return (
    <div>
      <ConversationList
        conversations={conversations}
        onSelect={setSelectedConversation}
      />
      <div>
        <MessageList messages={messages} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
