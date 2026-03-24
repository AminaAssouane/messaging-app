import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { UsersRound, MessageSquare, UserMinus } from "lucide-react";
import styles from "./FriendsList.module.css";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFriends() {
      const { data } = await api.get("/friends");
      setFriends(data);
    }
    fetchFriends();
  }, []);

  async function handleMessage() {
    navigate("/chat");
  }

  async function handleRemove(friendId) {
    await api.delete(`/friends/${friendId}`);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  }

  if (friends.length === 0)
    return (
      <div className={styles.noFriends}>
        <UsersRound className={styles.icon} />
        <p>No friends yet</p>
        <p>Go to Requests to find people</p>
      </div>
    );

  return (
    <div className={styles.friendsList}>
      <p className={styles.count}>My Friends ({friends.length})</p>
      <ul className={styles.list}>
        {friends.map((f) => (
          <li key={f.id} className={styles.friendItem}>
            {/* Avatar */}
            <div className={styles.avatar}>{f.username[0].toUpperCase()}</div>

            {/* Username */}
            <span className={styles.username}>{f.username}</span>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.actionBtn}
                onClick={() => handleMessage()}
                title="Message"
              >
                <MessageSquare size={18} />
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => handleRemove(f.id)}
                title="Remove friend"
              >
                <UserMinus size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
