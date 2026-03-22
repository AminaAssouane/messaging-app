import { useEffect, useState } from "react";
import api from "../../services/api";
import { UsersRound } from "lucide-react";
import styles from "./FriendsList.module.css";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      const { data } = await api.get("/friends");
      setFriends(data);
    }
    fetchFriends();
  }, []);

  if (friends.length === 0)
    return (
      <div className={styles.noFriends}>
        <UsersRound className={styles.icon} />
        <p>No friends yet</p>
        <p>Go to Requests to find people</p>
      </div>
    );

  return (
    <div className="friends-list">
      <h3>Friends</h3>
      <ul>
        {friends.map((f) => (
          <li key={f.id}>{f.username}</li>
        ))}
      </ul>
    </div>
  );
}
