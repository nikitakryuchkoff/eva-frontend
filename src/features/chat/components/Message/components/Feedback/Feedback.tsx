import { type FC, useState, useCallback } from 'react';

import classNames from 'classnames';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';

import { Message } from '@/enitites/message';
import { useFeedback } from '@/enitites/message';
import { Button, Tooltip } from '@/shared';

import styles from './Feedback.module.css';

interface FeedbackProps {
  messageId: string | number;
  message: Message;
  thumbUp?: boolean;
  thumbDown?: boolean;
}

export const Feedback: FC<FeedbackProps> = ({
  messageId,
  thumbUp: initialThumbUp,
  thumbDown: initialThumbDown,
  message,
}) => {
  const [copied, setCopied] = useState(false);

  const { thumbUp, thumbDown, isProcessing, handleLike, handleDislike, handleCopy } = useFeedback({
    messageId,
    thumbUp: initialThumbUp,
    thumbDown: initialThumbDown,
    message,
  });

  const onLikeClick = useCallback(async () => {
    await handleLike();
  }, [handleLike]);

  const onDislikeClick = useCallback(async () => {
    await handleDislike();
  }, [handleDislike]);

  const onCopyClick = useCallback(async () => {
    await handleCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [handleCopy]);

  return (
    <div className={styles.feedback}>
      <Tooltip content={thumbUp ? 'Вы отметили как полезный' : 'Полезный ответ'}>
        <Button
          variant="ghost"
          size="sm"
          className={classNames(styles.actionBtn, thumbUp && styles.actionBtnActive)}
          onClick={onLikeClick}
          disabled={isProcessing}
        >
          <ThumbsUp size={12} strokeWidth={2} />
        </Button>
      </Tooltip>

      <Tooltip content={thumbDown ? 'Вы отметили как бесполезный' : 'Бесполезный ответ'}>
        <Button
          variant="ghost"
          size="sm"
          className={classNames(styles.actionBtn, thumbDown && styles.actionBtnActive)}
          onClick={onDislikeClick}
          disabled={isProcessing}
        >
          <ThumbsDown size={12} strokeWidth={2} />
        </Button>
      </Tooltip>

      <Tooltip content={copied ? 'Скопировано!' : 'Копировать'}>
        <Button
          variant="ghost"
          size="sm"
          className={classNames(styles.actionBtn, copied && styles.actionBtnActive)}
          onClick={onCopyClick}
          disabled={isProcessing}
        >
          {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
        </Button>
      </Tooltip>
    </div>
  );
};
