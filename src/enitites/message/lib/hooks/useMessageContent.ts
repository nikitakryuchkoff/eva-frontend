import { TITLES } from '../../constants';
import { parseAnswerText } from '../utils';

export const useMessageContent = (answerText: string) => {
  const { title, messages, buttons, additionalInfo } = parseAnswerText(answerText);

  const showTitle = Boolean(title && title !== TITLES.DEFAULT && title !== TITLES.ANOTHER);
  const additionalText = additionalInfo?.split('<xbtn')[0] ?? null;

  const blocks = messages.map((item, index) => ({
    id: `block-${index}`,
    request: item.request,
    text: item.text ?? '',
  }));

  return {
    title,
    showTitle,
    blocks,
    additionalText,
    buttons,
  };
};
