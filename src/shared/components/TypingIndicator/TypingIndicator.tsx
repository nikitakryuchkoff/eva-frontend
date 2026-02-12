import styles from './TypingIndicator.module.css';

export const TypingIndicator = () => (
  <div className={styles.container}>
    <div className={styles.bubble}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  </div>
);
