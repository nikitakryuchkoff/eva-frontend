import { MessageTextContent } from '../../types';

const EMPTY_CONTENT = {
  title: null,
  messages: [],
  buttons: [],
  additionalInfo: null,
  action: null,
};

export const parseAnswerText = (answerText: string) => {
  try {
    const parsed = JSON.parse(answerText);

    if (typeof parsed === 'object' && parsed !== null && 'messages' in parsed) {
      return parsed as MessageTextContent;
    }

    return { ...EMPTY_CONTENT, messages: [{ text: answerText, classId: '1', request: null }] };
  } catch {
    return { ...EMPTY_CONTENT, messages: [{ text: answerText, classId: '1', request: null }] };
  }
};
