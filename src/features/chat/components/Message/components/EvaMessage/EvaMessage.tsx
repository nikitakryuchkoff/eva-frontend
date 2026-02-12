import { type FC, memo, useCallback } from 'react';
import classNames from 'classnames';
import styles from './EvaMessage.module.css';
import { Message, useMessageContent } from '@/enitites/message';
import { MessageContent } from '../MessageContent';
import { Feedback } from '../Feedback';
import { Button } from '@/shared';

interface Props {
  message: Message;
  onButtonClick?: (category: string, text: string, context?: string) => void;
  onResetContext?: () => void;
  onLinkClick?: (e: React.MouseEvent, href: string) => void;
  isLast: boolean;
  showResetContext: boolean;
  timeLabel?: string | null;
}

export const EvaMessage: FC<Props> = memo(
  ({
    message,
    onButtonClick,
    showResetContext,
    onLinkClick,
    isLast,
    onResetContext,
    timeLabel,
  }) => {
    const content = useMessageContent(message.answerText);

    const handleButtonClick = useCallback(
      (category: string, text: string) => {
        onButtonClick?.(category, text, '');
      },
      [onButtonClick],
    );

    const buttons = content.buttons ?? [];

    return (
      <div className={classNames(styles.message, styles.messageLeft)}>
        <div className={styles.assistantMeta}>
          <span className={styles.assistantBadge}>EVA</span>
          {timeLabel && <span className={styles.assistantTime}>{timeLabel}</span>}
        </div>

        <div className={styles.assistantBody}>
          <div className={classNames(styles.bubble, styles.bubbleBot)}>
            <MessageContent content={content} isLast={isLast} onLinkClick={onLinkClick} />
          </div>

          {buttons.length > 0 && (
            <div className={styles.actionsButtons}>
              {buttons.map((btn: { category: string; text: string }, idx: number) => (
                <Button
                  key={`${btn.category}-${idx}`}
                  type="button"
                  onClick={() => handleButtonClick(btn.category, btn.text)}
                  data-spec={`messages-btn-${idx}`}
                  variant="chat"
                >
                  {btn.text}
                </Button>
              ))}
              {showResetContext && (
                <Button type="button" variant="chat" onClick={onResetContext}>
                  Сбросить контекст
                </Button>
              )}
            </div>
          )}
        </div>

        {message.isLikeable && <Feedback messageId={message?.id} message={message} />}
      </div>
    );
  },
);
