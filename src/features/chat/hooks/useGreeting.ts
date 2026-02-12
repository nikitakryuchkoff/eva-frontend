import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Integration } from '@/enitites/integration';
import { fetchGreting, Message } from '@/enitites/message';
import { QUERY_KEYS } from '@/shared/consts';
import { useChatStore } from '@/shared/store';
import { MESSAGE_IDS, MessageAuthor } from '@/shared/types';

interface UseGreetingOptions {
  integrationId: string | null;
  source: string;
  me:
    | {
        login: string;
        name: string;
      }
    | undefined;
  selectedIntegration: Integration | null;
}

export const useGreeting = ({
  integrationId,
  source,
  me,
  selectedIntegration,
}: UseGreetingOptions) => {
  const { messages, addMessage, setThreadId } = useChatStore();

  const hasWelcome = messages.some((m) => m.id === MESSAGE_IDS.WELCOME);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GREETING, integrationId],
    queryFn: () => fetchGreting({ source, integrationId: integrationId!, threadId: null }),
    enabled: !!me && !!integrationId && !hasWelcome && !!selectedIntegration,
  });

  useEffect(() => {
    if (!data) return;

    const { title, threadId } = data;

    addMessage({
      id: MESSAGE_IDS.WELCOME,
      author: MessageAuthor.EVA,
      questionDate: new Date().toISOString(),
      answerText: title,
    } as Message);

    if (threadId) {
      setThreadId(threadId);
    }
  }, [data]);

  return { isLoading };
};
