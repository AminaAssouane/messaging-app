export default function ConversationList({
  conversations,
  selected,
  onSelect,
}) {
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
