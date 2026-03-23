import { useState } from "react";
import styles from "./MessageInput.module.css";
import { Send } from "lucide-react";

export default function MessageInput({ onSend, onTyping, className }) {
  const [content, setContent] = useState("");

  function handleSend() {
    if (!content) return;
    onSend(content);
    setContent("");
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className={`${styles.messageInput} ${className}`}>
      <input
        type="text"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onTyping?.();
        }}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSend}>
        <Send />
        Send
      </button>
    </div>
  );
}
