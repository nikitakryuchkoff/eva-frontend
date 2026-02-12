import { memo, useRef, useCallback, useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import classNames from 'classnames';
import { useChatStore, useClientStore } from '@/shared/store';

import styles from './Chat.module.css';
import { Integration, useFetchIntegrations } from '@/enitites/integration';
import { Message, sendMessage, sendMessageByButton, transformMessages } from '@/enitites/message';
import { useMobile } from '@/shared';
import { QUERY_KEYS } from '@/shared/consts';
import { ChatHeader } from '../ChatHeader';
import { ChatInput } from '../ChatInput';
import { useChatHistory, useGreeting } from '../../hooks';
import { MessageAuthor } from '@/shared/types';
import { useFetchMe } from '@/enitites/user';
import { VirtualizedChat } from '../VirtualizedChat/VirtualizedChat';

interface Props {
  source?: string;
}

export const Chat = memo(({ source = 'Nzk' }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMinimized = useClientStore((s) => s.isMinimized);

  const {
    messages,
    threadId,
    context,
    addMessage,
    setMessages,
    resetContext,
    setThreadId,
    setContext,
  } = useChatStore();

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [hasListError, setHasListError] = useState(false);

  const { me, isMeLoading } = useFetchMe();

  const { integrations, isIntegrationsLoading } = useFetchIntegrations({
    onIntegrationSelect: setSelectedIntegration,
  });

  const { isLoading: isSayHelloLoading } = useGreeting({
    integrationId: selectedIntegration?.id ?? null,
    source,
    me,
    selectedIntegration,
  });

  useMobile();

  const {
    isLoading: isHistoryLoading,
    hasMore,
    isFetchingMore,
    fetchNextPage,
    firstItemIndex,
  } = useChatHistory({
    integrationId: selectedIntegration?.id ?? null,
    enabled: !!selectedIntegration?.id && !!me,
  });

  const transformedMessages = useMemo(() => transformMessages(messages ?? []), [messages]);

  const { mutateAsync: sendMessageMutation, isPending: isSending } = useMutation({
    mutationKey: [QUERY_KEYS.SEND_MESSAGE],
    mutationFn: sendMessage,
    onSuccess: (response) => {
      const { threadId, context } = response;

      if (threadId) {
        setThreadId(response.threadId);
      }

      if (context) {
        setContext(response.context);
      }
    },
  });

  const { mutateAsync: sendMessageByButtonMutation } = useMutation({
    mutationKey: [QUERY_KEYS.SEND_MESSAGE_BY_BUTTON],
    mutationFn: sendMessageByButton,
    onSuccess: (response) => {
      const { threadId, context } = response;

      if (threadId) {
        setThreadId(response.threadId);
      }

      if (context) {
        setContext(response.context);
      }
    },
  });

  const onIntegrationChange = useCallback(
    (integration: Integration) => {
      setSelectedIntegration(integration);
      setMessages([]);
      resetContext();
    },
    [resetContext, setMessages],
  );

  const onSendMessage = useCallback(
    async (text: string) => {
      const integrationId = selectedIntegration?.id;
      if (!integrationId) return;

      const userMessage = {
        id: nanoid(),
        innerId: `${nanoid()}-user`,
        integrationId,
        questionDate: new Date().toISOString(),
        question: text,
        author: MessageAuthor.USER,
      } as Message;

      addMessage(userMessage);

      const response = await sendMessageMutation({
        id: nanoid(),
        title: text,
        source,
        integrationId,
        threadId,
        context,
      });

      const assistantMessage = {
        id: response.id,
        innerId: `${response.id}-bot`,
        integrationId,
        questionDate: new Date().toISOString(),
        author: MessageAuthor.EVA,
        question: null,
        answerText: response.title,
        isLikeable: response.isLikeable,
      } as Message;

      addMessage(assistantMessage);
    },
    [selectedIntegration?.id, threadId, context, source, addMessage, sendMessageMutation],
  );

  const onButtonSend = useCallback(
    async (category: string, text: string) => {
      const integrationId = selectedIntegration?.id;
      if (!integrationId) return;

      const userMessage = {
        id: nanoid(),
        innerId: `${nanoid()}-user`,
        integrationId,
        questionDate: new Date().toISOString(),
        question: text,
        author: MessageAuthor.USER,
      } as Message;

      addMessage(userMessage);

      const response = await sendMessageByButtonMutation({
        category,
        source,
        integrationId,
        threadId,
        context,
        title: text,
        query: null,
      });

      const assistantMessage = {
        id: response.id,
        innerId: `${response.id}-bot`,
        integrationId,
        questionDate: new Date().toISOString(),
        author: MessageAuthor.EVA,
        question: null,
        answerText: response.title,
        isLikeable: response.isLikeable,
      } as Message;

      addMessage(assistantMessage);
    },
    [selectedIntegration?.id, source, threadId, context, addMessage, sendMessageByButtonMutation],
  );

  const onButtonClick = useCallback(
    (category: string, label: string) => {
      onButtonSend(category, label);
    },
    [onButtonSend],
  );

  const isLoading = isMeLoading || isIntegrationsLoading || isHistoryLoading || isSayHelloLoading;

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, isMinimized && styles.minimized)}
      data-minimized={isMinimized}
    >
      <ChatHeader
        integrations={integrations}
        onChange={onIntegrationChange}
        currentIntegration={selectedIntegration}
        isLoading={isLoading}
      />

      <main className={styles.body}>
        {isLoading ? (
          <div className={styles.loadingScene}>
            <div className={styles.loadingList}>
              {Array.from({ length: 6 }).map((_, index) => {
                const isUserStub = index % 3 === 2;

                return (
                  <div
                    key={index}
                    className={classNames(
                      styles.loadingItem,
                      isUserStub ? styles.loadingItemRight : styles.loadingItemLeft,
                    )}
                  >
                    <div
                      className={classNames(
                        styles.loadingBubble,
                        isUserStub ? styles.loadingBubbleUser : styles.loadingBubbleBot,
                        styles.loadingPulse,
                      )}
                    >
                      <div className={classNames(styles.loadingLine, styles.loadingLineWide)} />
                      <div className={classNames(styles.loadingLine, styles.loadingLineMedium)} />
                      {!isUserStub && (
                        <div className={classNames(styles.loadingLine, styles.loadingLineShort)} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <VirtualizedChat
            messages={transformedMessages}
            firstItemIndex={firstItemIndex}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            fetchNextPage={fetchNextPage}
            onButtonClick={onButtonClick}
            isTyping={isSending}
            onError={() => setHasListError(true)}
            onResetError={() => setHasListError(false)}
          />
        )}
      </main>

      <footer className={styles.footer}>
        {isLoading ? (
          <div className={styles.loadingInputWrap}>
            <div className={classNames(styles.loadingInputInner, styles.loadingPulse)}>
              <div className={styles.loadingInputIcon} />
              <div className={styles.loadingInputLine} />
              <div className={styles.loadingSendButton} />
            </div>
          </div>
        ) : (
          <ChatInput
            onSend={onSendMessage}
            disabled={isSending || hasListError || isHistoryLoading}
          />
        )}
      </footer>
    </div>
  );
});
