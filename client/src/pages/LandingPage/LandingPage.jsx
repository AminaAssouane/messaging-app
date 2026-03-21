import styles from "./LandingPage.module.css";
import swan from "../../assets/icons/swan.svg";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.left}>
          <img src={swan} alt="icon" className={styles.swan} />
          <div className={styles.title}>Swan</div>
        </div>
        <nav className={styles.right}>
          <ThemeSwitcher />
          <button className={styles.loginBtn}>
            <Link to="/login">Login</Link>
          </button>
          <button className={styles.signUpBtn}>
            <Link to="/register">Sign Up</Link>
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.version}>v1.0 is now live</div>
        <h1 className={styles.title}>
          Connect at the <span className="violet">speed of light</span>.
        </h1>
        <p className={`${styles.details} secondary`}>
          Swan redefines how you chat. Simple, secure, and blazing fast
          messaging for everyone, everywhere.
        </p>
        <div className={styles.buttons}>
          <button className={styles.signUpBtn}>
            <Link to="/register">Get Started Free</Link>
          </button>
          <button className={styles.loginBtn}>
            <Link to="/login">Login</Link>
          </button>
        </div>
      </main>
      <footer className={`${styles.footer} secondary`}>
        <div className={styles.left}>© Made by Amina Assouane.</div>
        <div className={styles.right}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>
            <a
              href="https://github.com/AminaAssouane"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </span>
          <span>
            <a
              href="https://www.linkedin.com/in/amina-assouane/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
