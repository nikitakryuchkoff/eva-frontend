import { useEffect, useRef, useState } from 'react';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { fetchMessages, Messages } from '@/enitites/message';
import { QUERY_KEYS, useChatStore } from '@/shared';

interface UseChatHistoryOptions {
  integrationId: string | null;
  enabled: boolean;
  isInitialLoadDone?: boolean;
}

const START_INDEX = 10000000;

const getRenderableItemsCount = (items: Messages) =>
  items.reduce((count, item) => count + (item.question ? 1 : 0) + (item.answerText ? 1 : 0), 0);

export const useChatHistory = ({ integrationId, enabled }: UseChatHistoryOptions) => {
  const { messages, setMessages, prependMessages } = useChatStore();
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const pageCountRef = useRef(0);

  useEffect(() => {
    pageCountRef.current = 0;
    setFirstItemIndex(START_INDEX);
  }, [integrationId]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery<
    Messages,
    Error,
    InfiniteData<Messages>,
    readonly [typeof QUERY_KEYS.FETCH_MESSAGES, string | null],
    number
  >({
    queryKey: [QUERY_KEYS.FETCH_MESSAGES, integrationId],
    queryFn: ({ pageParam }) => fetchMessages(integrationId!, pageParam),
    initialPageParam: START_INDEX,
    enabled: enabled && !!integrationId,
    getNextPageParam: (lastPage) => {
      const lastId = lastPage[lastPage.length - 1]?.id;

      if (lastId === undefined || lastId === null) {
        return undefined;
      }

      const parsedLastId = Number(lastId);

      return Number.isFinite(parsedLastId) ? parsedLastId : undefined;
    },
  });

  useEffect(() => {
    if (!data?.pages?.length) return;

    const pagesCount = data.pages.length;

    if (pageCountRef.current === 0 && pagesCount > 0) {
      const firstPage = data.pages[0];
      if (!firstPage?.length) return;
      setMessages(firstPage);
      pageCountRef.current = 1;
      return;
    }

    if (pagesCount > pageCountRef.current) {
      const newPages = data.pages.slice(pageCountRef.current);
      const existingIds = new Set(messages.map((m) => m.id));
      const uniqueMessages = newPages.flat().filter((msg) => !existingIds.has(msg.id));

      if (uniqueMessages.length > 0) {
        const prependedItemsCount = getRenderableItemsCount(uniqueMessages);
        setFirstItemIndex((prev) => prev - prependedItemsCount);
        prependMessages(uniqueMessages);
      }

      pageCountRef.current = pagesCount;
    }
  }, [data, messages, setMessages, prependMessages]);

  return {
    messages,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    fetchNextPage,
    firstItemIndex,
  };
};
