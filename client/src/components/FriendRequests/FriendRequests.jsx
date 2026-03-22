import { useEffect, useState } from "react";
import api from "../../services/api";
import FriendSearch from "../FriendSearch/FriendSearch";
import styles from "./FriendRequests.module.css";
import { Inbox, UserRound, Check, X } from "lucide-react";

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

  if (requests.length === 0)
    return (
      <div>
        <FriendSearch />
        <div className={styles.noRequestsContainer}>
          <Inbox className={styles.noRequestsIcon} />
          <p>No pending requests</p>
        </div>
      </div>
    );

  return (
    <div className={styles.friendRequestsContainer}>
      <FriendSearch />
      <div className={styles.friendRequests}>
        <h3>Pending Requests ({requests.length})</h3>
        <ul>
          {requests.map((r) => (
            <li key={r.id} className={styles.friendRequest}>
              <div className={styles.requestUser}>
                <UserRound className={styles.userIcon} />
                <div className={styles.requestInfo}>
                  <span>{r.sender.username}</span>
                  <p>sent you a friend request</p>
                </div>
              </div>
              <div className={styles.requestButtons}>
                <Check
                  onClick={() => handleAccept(r.id)}
                  className={styles.check}
                />
                <X onClick={() => handleReject(r.id)} className={styles.x} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
