import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <h2 className={styles.title}>Welcome back!</h2>
        <p>Login to continue your chats.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <div className={styles.footer}>
          Don't have an account? <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
