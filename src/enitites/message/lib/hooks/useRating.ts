import { useState, useCallback, useMemo } from 'react';
import { useChatStore } from '@/shared/store';
import { RATING } from '../../constants';

interface UseRatingParams {
  message: ScoringMessage;
}

export const useRating = ({ message }: UseRatingParams) => {
  const { threadId, addMessage, setHasOperatorChat, setThreadInFeedbackState } = useChatStore();

  const [rating, setRatingValue] = useState(message.tempRatingValue ?? 0);
  const [comment, setComment] = useState(message.comment ?? '');

  // const { mutate, isPending } = useMutation({
  //   mutationFn: (data: { rating: number | null; comment: string | null }) =>
  //     messagesApi.rateThread(threadId!, data.rating, data.comment),
  //   onSuccess: (_, { rating, comment }) => {
  //     setHasOperatorChat(false);
  //     setThreadInFeedbackState(false);

  //     addMessage({
  //       id: nanoid(),
  //       threadId: threadId ?? '',
  //       role: 'assistant',
  //       content: '',
  //       timestamp: Date.now(),
  //       isScoringMessage: true,
  //       actualRatingValue: rating,
  //       comment: comment ?? undefined,
  //     });
  //   },
  // });

  const setRating = useCallback(
    (value: number) => {
      setRatingValue(value);
      message.tempRatingValue = value;
    },
    [message],
  );

  const isSubmitDisabled = useMemo(() => {
    return !rating || (rating <= RATING.THRESHOLD && !comment.trim());
  }, [rating, comment]);

  const submit = useCallback(() => {
    if (isSubmitDisabled || !threadId) return;
    // mutate({ rating, comment: comment || null });
  }, [isSubmitDisabled, threadId, rating, comment]);

  const reject = useCallback(() => {
    if (!threadId) return;
    // mutate({ rating: null, comment: null });
  }, [threadId]);

  return {
    rating,
    comment,
    isSubmitDisabled,
    isPending: false,
    setRating,
    setComment,
    submit,
    reject,
  };
};
