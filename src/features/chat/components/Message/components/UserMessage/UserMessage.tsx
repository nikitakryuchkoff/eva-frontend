import { type FC, memo } from 'react';

import classNames from 'classnames';
import { CheckCheck } from 'lucide-react';

import { Message } from '@/enitites/message';
import { Markdown } from '@/shared';

import styles from './UserMessage.module.css';

interface Props {
  message: Message;
  timeLabel?: string | null;
}

export const UserMessage: FC<Props> = memo(({ message, timeLabel }) => {
  return (
    <div className={classNames(styles.message, styles.messageRight)}>
      <div className={classNames(styles.bubble, styles.bubbleUser)}>
        <div className={styles.text}>
          <Markdown text={message?.question ?? ''} />
        </div>
      </div>

      {timeLabel && (
        <div className={classNames(styles.meta, styles.metaRight)}>
          <CheckCheck size={14} className={styles.readIcon} />
          {timeLabel}
        </div>
      )}
    </div>
  );
});
