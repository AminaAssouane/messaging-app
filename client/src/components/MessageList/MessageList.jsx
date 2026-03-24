import styles from "./MessageList.module.css";
import { useEffect, useRef } from "react";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.messageList}>
      {messages.map((msg, index) => {
        const isOwn = msg.sender.id === currentUserId;

        // Show date separator when the day changes
        const prevMsg = messages[index - 1];
        const showDate =
          !prevMsg ||
          formatDate(msg.createdAt) !== formatDate(prevMsg.createdAt);

        return (
          <div key={msg.id}>
            {showDate && (
              <div className={styles.dateSeparator}>
                <span>{formatDate(msg.createdAt)}</span>
              </div>
            )}

            <div
              className={`${styles.row} ${isOwn ? styles.rowOwn : styles.rowOther}`}
            >
              {isOwn ? (
                // Own message — right side, purple bubble
                <div className={styles.ownWrapper}>
                  <div className={styles.ownBubble}>{msg.content}</div>
                  <span className={styles.time}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              ) : (
                // Other message — left side, dark bubble with name
                <div className={styles.otherWrapper}>
                  <span className={styles.senderName}>
                    {msg.sender.username}
                  </span>
                  <div className={styles.otherRow}>
                    <span className={styles.time}>
                      {formatTime(msg.createdAt)}
                    </span>
                    <div className={styles.otherBubble}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
