import styles from "./ConversationList.module.css";
import { UserRound, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConversationList({
  conversations,
  onSelect,
  selectedConversation,
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.conversationList}>
      <div className={styles.title}>Conversations</div>
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`${styles.conversation} ${selectedConversation?.id === conv.id ? styles.active : ""}`}
          onClick={() => {
            navigate("/chat");
            onSelect(conv);
          }}
        >
          <div className={styles.avatar}>
            {conv.type === "PRIVATE" ? (
              <UserRound className={styles.icon} />
            ) : (
              <UsersRound className={styles.icon} />
            )}
          </div>
          <div className={styles.name}>{conv.name || "Private Chat"}</div>
        </div>
      ))}
    </div>
  );
}
