import { axiosInstance } from '@/shared/api';
import { MentionEmployee } from './types';

export const fetchName = async () => {
  const { data } = await axiosInstance.get<string>('/eva/api/ChatBot/name');

  return data;
};

export const fetchEmail = async () => {
  const { data } = await axiosInstance.get<string>('/eva/api/ChatBot/mail');

  return data;
};

export const fetchUsers = async (q: string, take: number, skip: number) => {
  const { data } = await axiosInstance.get<MentionEmployee[]>('eva/api/info/roster/find', {
    params: { q, take, skip, source: 'E' },
  });

  return data;
};
