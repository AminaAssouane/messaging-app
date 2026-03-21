import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import styles from "./Logout.module.css";

export default function Logout() {
  const navigate = useNavigate();
  function handleClick() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <button onClick={handleClick} className={styles.logoutBtn}>
      <LogOut size={20} />
    </button>
  );
}
