import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <hr />
          <em>{year}@烈嶼鄉公所</em>
    </footer>
  )
}
