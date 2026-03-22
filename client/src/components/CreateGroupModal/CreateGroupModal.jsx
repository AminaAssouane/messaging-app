import { useState } from "react";
import { createGroup } from "../../services/api";
import styles from "./CreateGroupModal.module.css";

export default function CreateGroupModal({ friends, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  function toggleFriend(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    try {
      const group = await createGroup(name, selected);
      onCreated(group);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to create group");
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Group</h2>
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>Invite friends:</p>
        <ul>
          {friends.map((f) => (
            <li key={f.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(f.id)}
                  onChange={() => toggleFriend(f.id)}
                />
                {f.username}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
