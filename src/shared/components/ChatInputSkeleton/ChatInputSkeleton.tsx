import classNames from 'classnames';

import styles from './ChatInputSkeleton.module.css';

export const ChatInputSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <div className={classNames(styles.inner, styles.pulse)}>
        <div className={styles.line} />
        <div className={styles.footerRow}>
          <div className={styles.selectStub} />
          <div className={styles.sendButton} />
        </div>
      </div>
    </div>
  );
};
