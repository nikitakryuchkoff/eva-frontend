import { Message, MessageTextContent } from '@/enitites/message';

export const parseTextContent = (message: Message): MessageTextContent | null => {
  if (message.answerText) {
    try {
      return JSON.parse(message.answerText);
    } catch {
      return null;
    }
  }

  return null;
};
