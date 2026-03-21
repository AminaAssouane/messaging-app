import styles from "./LandingPage.module.css";
import swan from "../../assets/icons/swan.svg";
export default function LandingPage() {
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.left}>
          <img src={swan} alt="icon" className={styles.swan} />
          <div className={styles.title}>Swan</div>
        </div>
        <nav className={styles.right}>
          <button onClick={toggleTheme}>Toggle theme</button>
          <button>Login</button>
          <button>Sign up</button>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.version}>v1.0 is now live</div>
        <h1 className={styles.title}>
          Connect at the <span className="violet">speed of light</span>.
        </h1>
        <p className={`${styles.details} secondary`}>
          Quark redefines how you chat. Simple, secure, and blazing fast
          messaging for everyone, everywhere.
        </p>
        <div className={styles.buttons}>
          <button>Get Started Free</button>
          <button>Login</button>
        </div>
      </main>
      <footer className={`${styles.footer} secondary`}>
        <div className={styles.left}>© Made by Amina Assouane.</div>
        <div className={styles.right}>
          <button>Privacy</button>
          <button>Terms</button>
          <button>Github</button>
          <button>LinkedIn</button>
        </div>
      </footer>
    </div>
  );
}
