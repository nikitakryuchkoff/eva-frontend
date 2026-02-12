import { type FC, memo, type ChangeEvent, useCallback } from 'react';
import classNames from 'classnames';

import styles from '../../Message.module.css';
import { useRating } from '@/enitites/message/lib/hooks';
import { useChatStore } from '@/shared/store';
import { Message } from '@/enitites/message';

interface Props {
  message: Message;
  timeLabel?: string | null;
}

export const ScoringBubble: FC<Props> = memo(({ message, timeLabel }) => {
  const { threadInFeedbackState } = useChatStore();

  const { rating, comment, isSubmitDisabled, isPending, setRating, setComment, submit, reject } =
    useRating({ message });

  const handleCommentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value),
    [setComment],
  );

  return (
    <div className={classNames(styles.message, styles.messageLeft)}>
      <div className={classNames(styles.bubble, styles.bubbleBot)}>
        <p className={styles.text}>{message.content}</p>
      </div>

      {timeLabel && <div className={classNames(styles.meta, styles.metaLeft)}>{timeLabel}</div>}

      <div className={styles.ratingBlock}>
        {/* <RatingStars
          value={hasActualRating ? message.actualRatingValue! : rating}
          disabled={hasActualRating || !threadInFeedbackState}
          onChange={setRating}
        />

        {!hasActualRating && (
          <RatingForm
            rating={rating}
            comment={comment}
            disabled={hasActualRating}
            showSubmit={threadInFeedbackState}
            isSubmitDisabled={isSubmitDisabled || isPending}
            onCommentChange={handleCommentChange}
            onSubmit={submit}
            onReject={reject}
          />
        )} */}

        {/* {hasActualRating && message.comment && (
          <div className={styles.ratingCommentDisplay}>{message.comment}</div>
        )} */}
      </div>
    </div>
  );
});
