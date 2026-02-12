import { type FC, memo } from 'react';
import classNames from 'classnames';

import styles from './UserMessage.module.css';
import { Message } from '@/enitites/message';
import { Markdown } from '@/shared';

interface Props {
  message: Message;
  timeLabel?: string | null;
}

export const UserMessage: FC<Props> = memo(({ message, timeLabel }) => {
  return (
    <div className={classNames(styles.message, styles.messageRight)}>
      {timeLabel && <div className={classNames(styles.meta, styles.metaRight)}>{timeLabel}</div>}

      <div className={classNames(styles.bubble, styles.bubbleUser)}>
        <div className={styles.text}>
          <Markdown text={message?.question ?? ''} />
        </div>
      </div>
    </div>
  );
});
