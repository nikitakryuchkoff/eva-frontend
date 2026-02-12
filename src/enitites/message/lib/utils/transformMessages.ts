import { Messages } from '@/enitites/message';
import { MessageAuthor } from '@/shared/types';

export const transformMessages = (messages: Messages) => {
  const result: Messages = [];

  messages.forEach((message) => {
    if (message.question) {
      result.push({
        ...message,
        author: MessageAuthor.USER,
        innerId: `user-${message.id}`,
      });
    }

    if (message.answerText) {
      result.push({
        ...message,
        author: MessageAuthor.EVA,
        innerId: `eva-${message.id}`,
      });
    }
  });

  return result.sort((a, b) => {
    const dateA = new Date(a.questionDate).getTime();
    const dateB = new Date(b.questionDate).getTime();
    return dateA - dateB;
  });
};
