import { QUERY_KEYS } from '@/shared';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchEmail, fetchName, fetchUsers } from './api';

export const useFetchMe = () => {
  const { data: me, isFetching: isMeLoading } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_ME],
    queryFn: async () => {
      const [name, login] = await Promise.all([fetchName(), fetchEmail()]);

      return { name, login };
    },
  });

  return { me, isMeLoading };
};

const TAKE = 10;

export const useFetchUsers = (query: string, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.FETCH_USERS, query],
    queryFn: ({ pageParam = 0 }) => fetchUsers(query, TAKE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === TAKE ? lastPageParam + TAKE : undefined,
    enabled,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
};
