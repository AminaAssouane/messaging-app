import styles from "./LandingPage.module.css";
import swan from "../../assets/icons/swan.svg";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";

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
          <button className={styles.loginBtn}>Login</button>
          <button className={styles.signUpBtn}>Sign Up</button>
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
          <button className={styles.signUpBtn}>Get Started Free</button>
          <button className={styles.loginBtn}>Login</button>
        </div>
      </main>
      <footer className={`${styles.footer} secondary`}>
        <div className={styles.left}>© Made by Amina Assouane.</div>
        <div className={styles.right}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Github</span>
          <span>LinkedIn</span>
        </div>
      </footer>
    </div>
  );
}
