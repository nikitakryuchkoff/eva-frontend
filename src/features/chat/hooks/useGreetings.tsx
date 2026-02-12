import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '@/shared/store';
import { QUERY_KEYS } from '@/shared/consts';
import { fetchGreting, Message } from '@/enitites/message';
import { MESSAGE_IDS, MessageAuthor } from '@/shared/types';
import { Integration } from '@/enitites/integration';

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
  const { messages, addMessage, setGreetingLoading, setThreadId } = useChatStore();

  const hasWelcome = messages.some((m) => m.id === MESSAGE_IDS.WELCOME);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GREETING, integrationId],
    queryFn: () => fetchGreting({ source, integrationId: integrationId!, threadId: null }),
    enabled: !!me && !!integrationId && !hasWelcome && !!selectedIntegration,
  });

  useEffect(() => {
    setGreetingLoading(isLoading);
  }, [isLoading, setGreetingLoading]);

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
