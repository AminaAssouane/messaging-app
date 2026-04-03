import { NavLink, Outlet } from "react-router-dom";
import styles from "./FriendsPage.module.css";
import { useOutletContext } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

export default function FriendsPage() {
  const { onBack } = useOutletContext();

  return (
    <main className={styles.friendsPage}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowBigLeft />
      </button>
      <div className={styles.toggle}>
        <NavLink
          to="/friends"
          end
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          Friends
        </NavLink>
        <NavLink
          to="/friends/requests"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          Requests
        </NavLink>
      </div>

      <Outlet />
    </main>
  );
}
