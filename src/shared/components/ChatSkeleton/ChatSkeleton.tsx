import classNames from 'classnames';

import styles from './ChatSkeleton.module.css';

export const ChatSkeleton = () => {
  return (
    <div className={styles.scene}>
      <div className={styles.list}>
        {Array.from({ length: 6 }).map((_, index) => {
          const isUserStub = index % 3 === 2;

          return (
            <div
              key={index}
              className={classNames(styles.item, isUserStub ? styles.itemRight : styles.itemLeft)}
            >
              <div
                className={classNames(
                  styles.bubble,
                  isUserStub ? styles.bubbleUser : styles.bubbleBot,
                  styles.pulse,
                )}
              >
                <div className={classNames(styles.line, styles.lineWide)} />
                <div className={classNames(styles.line, styles.lineMedium)} />
                {!isUserStub && <div className={classNames(styles.line, styles.lineShort)} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
