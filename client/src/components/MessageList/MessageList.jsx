export default function MessageList({ messages }) {
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <b>{msg.sender.username}: </b>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
