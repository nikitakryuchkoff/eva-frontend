import { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { nanoid } from 'nanoid';

import { MessageAuthor, messageConverter, REACTIONS } from '@/shared';
import { FEEDBACK_TEXT } from '@/shared/consts';
import { useChatStore } from '@/shared/store';

import { Message, parseAnswerText, sendLikeDislike } from '../..';

interface UseFeedbackParams {
  messageId: string | number;
  thumbUp?: boolean | undefined;
  thumbDown?: boolean | undefined;
  message: Message;
}

export const useFeedback = ({ messageId, thumbUp, thumbDown, message }: UseFeedbackParams) => {
  const { addMessage } = useChatStore();
  const [currentThumbUp, setCurrentThumbUp] = useState(Boolean(thumbUp));
  const [currentThumbDown, setCurrentThumbDown] = useState(Boolean(thumbDown));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (vars: { messageId: string; value: REACTIONS }) =>
      sendLikeDislike({ messageId: vars.messageId, value: vars.value }),
  });

  const handleLike = useCallback(async () => {
    setCurrentThumbUp(true);
    setCurrentThumbDown(false);
    await mutateAsync({ messageId: String(messageId), value: REACTIONS.LIKE });
  }, [messageId, mutateAsync]);

  const handleDislike = useCallback(async () => {
    setCurrentThumbUp(false);
    setCurrentThumbDown(true);
    await mutateAsync({ messageId: String(messageId), value: REACTIONS.DISLIKE });

    addMessage({
      id: nanoid(),
      innerId: `${nanoid()}-feedback`,
      author: MessageAuthor.EVA,
      questionDate: new Date().toISOString(),
      answerText: FEEDBACK_TEXT[REACTIONS.DISLIKE],
    } as Message);
  }, [addMessage, messageId, mutateAsync]);

  const handleCopy = useCallback(async () => {
    const { messages } = parseAnswerText(message.answerText);
    const html = messageConverter(messages);

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([html], { type: 'text/plain' }),
      }),
    ]);
  }, [message]);

  return {
    thumbUp: currentThumbUp,
    thumbDown: currentThumbDown,
    isProcessing: isPending,
    handleLike,
    handleDislike,
    handleCopy,
  };
};
