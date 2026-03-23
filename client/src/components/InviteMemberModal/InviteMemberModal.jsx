import { useState } from "react";
import { inviteMember } from "../../services/api";
import styles from "./InviteMemberModal.module.css";
import { UserPlus } from "lucide-react";

export default function InviteMemberModal({ groupId, friends, onClose }) {
  const [status, setStatus] = useState({});

  async function handleInvite(userId) {
    try {
      await inviteMember(groupId, userId);
      setStatus((s) => ({ ...s, [userId]: "Invited ✓" }));
    } catch (err) {
      const msg = err.response?.data?.error ?? "Failed";
      setStatus((s) => ({ ...s, [userId]: msg }));
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.header}>Invite Member</h2>
        <ul>
          {friends.map((f) => (
            <li key={f.id} className={styles.friend}>
              {f.username}
              <button
                onClick={() => handleInvite(f.id)}
                disabled={!!status[f.id]}
                className={styles.addUserBtn}
              >
                {status[f.id] ?? <UserPlus />}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
}
