import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FriendRequests({ onAccepted }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      const { data } = await api.get("/friends/requests");
      setRequests(data);
    }
    fetchRequests();
  }, []);

  async function handleAccept(id) {
    const { data } = await api.post(`/friends/${id}/accept`);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (onAccepted) onAccepted(data.conversationId);
  }

  async function handleReject(id) {
    await api.post(`/friends/${id}/reject`);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (requests.length === 0) return <p>No pending requests.</p>;

  return (
    <div className="friend-requests">
      <h3>Friend Requests</h3>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            <span>{r.sender.username}</span>
            <button onClick={() => handleAccept(r.id)}>✔ Accept</button>
            <button onClick={() => handleReject(r.id)}>❌ Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
