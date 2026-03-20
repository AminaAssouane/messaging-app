import { useState } from "react";

export default function MessageInput({ onSend }) {
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
    <div>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
