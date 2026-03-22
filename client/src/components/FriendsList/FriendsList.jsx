import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      const { data } = await api.get("/friends");
      setFriends(data);
    }
    fetchFriends();
  }, []);

  if (friends.length === 0) return <p>No friends yet.</p>;

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
