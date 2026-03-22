import { useState } from "react";
import api from "../services/api";

export default function FriendSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  async function handleSearch(e) {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) return setResults([]);
    const { data } = await api.get(`/users/search?username=${val}`);
    setResults(data);
  }

  async function handleAdd(username) {
    const { data } = await api.post("/friends/request", { username });
    setMessage(data.message || "Request sent!");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="friend-search">
      <h3>Search Users</h3>
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={handleSearch}
      />
      {message && <p className="success-msg">{message}</p>}
      <ul>
        {results.map((user) => (
          <li key={user.id}>
            <span>{user.username}</span>
            <button onClick={() => handleAdd(user.username)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
