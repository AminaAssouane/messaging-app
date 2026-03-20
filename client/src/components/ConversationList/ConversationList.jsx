export default function ConversationList({ conversations, onSelect }) {
  return (
    <div>
      {conversations.map((conv) => (
        <div key={conv.id} onClick={() => onSelect(conv)}>
          {conv.name || "Private Chat"}
        </div>
      ))}
    </div>
  );
}
