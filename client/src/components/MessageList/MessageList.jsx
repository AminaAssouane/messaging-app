import styles from "./MessageList.module.css";
export default function MessageList({ messages }) {
  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <div key={msg.id}>
          <b>{msg.sender.username}: </b>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
