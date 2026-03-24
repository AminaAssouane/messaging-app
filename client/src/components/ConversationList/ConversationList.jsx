// frontend/src/components/ConversationList/ConversationList.jsx
import styles from "./ConversationList.module.css";
import { UserRound, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConversationList({
  conversations,
  onSelect,
  selectedConversation,
  onlineUsers,
  currentUserId,
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.conversationList}>
      <div className={styles.title}>Conversations</div>
      {conversations.map((conv) => {
        const otherUser =
          conv.type === "PRIVATE"
            ? conv.members.find((m) => m.user.id !== currentUserId)?.user
            : null;

        const isOnline = otherUser ? onlineUsers?.has(otherUser.id) : false;
        const displayName = conv.name || otherUser?.username || "Private Chat";

        const lastMessage = conv.messages?.[conv.messages.length - 1];

        return (
          <div
            key={conv.id}
            className={`${styles.conversation} ${selectedConversation?.id === conv.id ? styles.active : ""}`}
            onClick={() => {
              navigate("/chat");
              onSelect(conv);
            }}
          >
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {conv.type === "PRIVATE" ? (
                  <UserRound className={styles.icon} />
                ) : (
                  <UsersRound className={styles.icon} />
                )}
              </div>
              {conv.type === "PRIVATE" && (
                <span
                  className={isOnline ? styles.dotOnline : styles.dotOffline}
                />
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.topRow}>
                <span className={styles.name}>{displayName}</span>
                {conv.unreadCount > 0 && (
                  <span className={styles.badge}>{conv.unreadCount}</span>
                )}
              </div>
              {lastMessage && (
                <div className={styles.preview}>{lastMessage.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
