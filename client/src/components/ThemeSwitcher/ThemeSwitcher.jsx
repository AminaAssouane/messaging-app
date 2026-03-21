import styles from "./ThemeSwitcher.module.css";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeSwitcher({ className }) {
  const [theme, setTheme] = useState("dark");

  function handleTheme(theme) {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    setTheme(theme);
  }

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className={`${styles.themeSwitcher} ${className || ""}`}>
      <button
        className={theme === "dark" ? styles.active : ""}
        onClick={() => handleTheme("dark")}
      >
        <Moon size={20} />
      </button>
      <button
        className={theme === "light" ? styles.active : ""}
        onClick={() => handleTheme("light")}
      >
        <Sun size={20} />
      </button>
    </div>
  );
}
