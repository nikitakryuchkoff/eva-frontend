import { isUserMessage, isAssistantMessage, Message as MessageType } from '@/enitites/message';
import { type FC, memo } from 'react';
import { EvaMessage } from './components/EvaMessage';
import { UserMessage } from './components/UserMessage';
import { useChatStore } from '@/shared';
import { TypingIndicator } from '@/shared/components';
import { formatQuestionDate } from '@/shared/lib/utils';
import styles from './Message.module.css';

interface Props {
  message: MessageType;
  messages: MessageType[];
  index: number;
  onButtonClick: (category: string, text: string, context?: string) => void;
  isTyping?: boolean;
}

export const Message: FC<Props> = memo((props) => {
  const { message, index, messages, onButtonClick, isTyping = false } = props;

  const { threadId, context, resetContext } = useChatStore();

  const isLast = index === messages.length - 1;
  const showTypingIndicator = isTyping && isLast;

  const isLastMessageNotWelcome =
    isLast && messages.length > 0 && messages[messages.length - 1]?.id !== 'welcome';

  const showResetContext = (!!context || !!threadId) && isLastMessageNotWelcome;
  const timeLabel = formatQuestionDate(message.questionDate);

  if (isUserMessage(message)) {
    return (
      <>
        <UserMessage message={message} timeLabel={timeLabel} />
        {showTypingIndicator && (
          <div className={styles.typingWrap}>
            <TypingIndicator />
          </div>
        )}
      </>
    );
  }

  if (isAssistantMessage(message)) {
    return (
      <>
        <EvaMessage
          message={message}
          isLast={isLast}
          showResetContext={showResetContext}
          onResetContext={resetContext}
          onButtonClick={onButtonClick}
          timeLabel={timeLabel}
        />
        {showTypingIndicator && (
          <div className={styles.typingWrap}>
            <TypingIndicator />
          </div>
        )}
      </>
    );
  }

  return null;
});
