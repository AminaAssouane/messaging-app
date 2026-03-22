import { NavLink, Outlet } from "react-router-dom";
import styles from "./FriendsPage.module.css";

export default function FriendsPage() {
  return (
    <main className={styles.friendsPage}>
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
