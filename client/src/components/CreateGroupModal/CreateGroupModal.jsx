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
    if (name.trim().length < 3 || name.trim().length > 20) {
      setError("Group name must be 3–20 characters");
      return;
    }
    try {
      const group = await createGroup(name.trim(), selected);
      onCreated(group);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to create group");
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>Create Group</span>
        </div>

        <label className={styles.label}>Group Name</label>
        <input
          className={styles.input}
          placeholder="Enter group name (3–20 characters)"
          value={name}
          maxLength={20}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        {error && <p className={styles.error}>{error}</p>}

        {friends.length > 0 && (
          <>
            <label className={styles.label}>Invite Friends</label>
            <ul className={styles.friendList}>
              {friends.map((f) => (
                <li
                  key={f.id}
                  className={`${styles.friendItem} ${
                    selected.includes(f.id) ? styles.selected : ""
                  }`}
                  onClick={() => toggleFriend(f.id)}
                >
                  <div className={styles.avatar}>
                    {f.username[0].toUpperCase()}
                  </div>
                  <span>{f.username}</span>
                  {selected.includes(f.id) && (
                    <span className={styles.check}>✓</span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.createBtn} onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
