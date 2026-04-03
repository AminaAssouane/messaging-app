import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./Profile.module.css";
import api from "../../services/api";
import { ArrowBigLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const { onBack } = useOutletContext();

  useEffect(() => {
    async function fetchSelf() {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch self. ", error);
      }
    }
    fetchSelf();
  }, []);

  if (!profile)
    return (
      <div>
        <ClipLoader color="#8e51ff" />
      </div>
    );

  return (
    <main className={styles.profilePage}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowBigLeft />
      </button>
      <h2 className={styles.title}>Profile</h2>
      <div className={styles.infoWrapper}>
        <section className={styles.infoContainer}>
          <div className={styles.username}>
            <p>Username</p>
            <p>{profile.username}</p>
          </div>
          <div className={styles.email}>
            <p>Email</p>
            <p>{profile.email}</p>
          </div>
          <div className={styles.date}>
            <p>Member since</p>
            <p>
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
