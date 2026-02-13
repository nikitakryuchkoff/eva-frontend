import { memo, useRef, useCallback, useState, useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { VirtuosoHandle } from 'react-virtuoso';

import { Integration, useFetchIntegrations } from '@/enitites/integration';
import { Message, sendMessage, sendMessageByButton, transformMessages } from '@/enitites/message';
import { useFetchMe } from '@/enitites/user';
import { useMobile } from '@/shared';
import { ChatInputSkeleton, ChatSkeleton } from '@/shared/components';
import { QUERY_KEYS } from '@/shared/consts';
import { useChatStore, useClientStore } from '@/shared/store';
import { MessageAuthor } from '@/shared/types';

import styles from './Chat.module.css';
import { useChatHistory, useGreeting } from '../../hooks';
import { ChatHeader } from '../ChatHeader';
import { ChatInput } from '../ChatInput';
import { VirtualizedChat } from '../VirtualizedChat';

interface Props {
  source?: string;
}

export const Chat = memo(({ source = 'Nzk' }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMinimized = useClientStore((s) => s.isMinimized);
  const setOpen = useClientStore((s) => s.setOpen);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

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

  const scrollToBottom = () => {
    virtuosoRef.current?.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: 'smooth',
    });
  };

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

  const onIntegrationChange = useCallback((integration: Integration) => {
    setSelectedIntegration(integration);
    setMessages([]);
    resetContext();
  }, []);

  const onSendMessage = useCallback(
    async (text: string) => {
      const integrationId = selectedIntegration?.id as string;

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

      scrollToBottom();
    },
    [selectedIntegration?.id, threadId, context, source, addMessage, sendMessageMutation],
  );

  const onButtonSend = useCallback(
    async (category: string, text: string) => {
      const integrationId = selectedIntegration?.id as string;

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

      scrollToBottom();
    },
    [selectedIntegration?.id, source, threadId, context, addMessage, sendMessageByButtonMutation],
  );

  const onButtonClick = useCallback((category: string, label: string) => {
    onButtonSend(category, label);
  }, []);

  const isLoading = isMeLoading || isIntegrationsLoading || isHistoryLoading || isSayHelloLoading;

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, isMinimized && styles.minimized)}
      data-minimized={isMinimized}
    >
      <ChatHeader onClose={() => setOpen(false)} />

      <main className={styles.body}>
        {isLoading ? (
          <ChatSkeleton />
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
            ref={virtuosoRef}
          />
        )}
      </main>

      <footer className={styles.footer}>
        {isLoading ? (
          <ChatInputSkeleton />
        ) : (
          <ChatInput
            onSend={onSendMessage}
            integrations={integrations}
            currentIntegration={selectedIntegration}
            onIntegrationChange={onIntegrationChange}
            isIntegrationsLoading={isIntegrationsLoading}
            disabled={isSending || hasListError || isHistoryLoading}
          />
        )}
      </footer>
    </div>
  );
});
