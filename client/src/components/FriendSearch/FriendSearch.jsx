import { useState } from "react";
import api from "../../services/api";
import styles from "./FriendSearch.module.css";
import { Search, UserPlus } from "lucide-react";

export default function FriendSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  async function handleSearch(e) {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 1) return setResults([]);
    try {
      const { data } = await api.get(`/users/search?username=${val}`);
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAdd(username) {
    try {
      const { data } = await api.post("/friends/request", { username });
      setMessage(data.message || "Request sent!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add friend ", error);
    }
  }

  return (
    <div className={styles.friendSearch}>
      <div className={styles.searchWrapper}>
        <Search
          className={`${styles.searchIcon} ${isFocused ? styles.searchIconFocused : ""}`}
          size={18}
        />
        <input
          type="text"
          placeholder="Find friends by username..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {message && <p className={styles.successMessage}>{message}</p>}
      <ul>
        {results.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <span>{user.username}</span>
            <UserPlus
              onClick={() => handleAdd(user.username)}
              className={styles.userPlusIcon}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
