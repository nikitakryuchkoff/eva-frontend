import { axiosInstance } from '@/shared/api';
import { MessageRequest, Messages, MessageResponse, MessageButtonRequest } from './types';
import { REACTIONS } from '@/shared';

export const fetchMessages = async (integrationId: string, id: number = 10000000) => {
  const { data } = await axiosInstance.get<Messages>(
    `/eva/api/ChatBot/history/${id}?integrationId=${integrationId}`,
  );

  return data;
};

export const fetchGreting = async ({
  source,
  integrationId,
  threadId,
}: {
  source: string;
  integrationId: string;
  threadId: string | null;
}) => {
  const { data } = await axiosInstance.post<{
    title: string;
    threadId: string | null;
  }>(`/eva/api/ChatBot/sayHello`, {
    source,
    integrationId,
    threadId,
  });

  return data;
};

export const sendLikeDislike = async ({
  messageId,
  value,
}: {
  messageId: string;
  value: REACTIONS;
}): Promise<void> => {
  await axiosInstance.post('/eva/api/ChatBot/setLike', {
    id: messageId,
    value,
  });
};

export const sendMessage = async (body: MessageRequest): Promise<MessageResponse> => {
  const formData = new FormData();

  formData.append('Id', body.id);
  formData.append('Source', body.source);
  formData.append('Title', body.title);
  formData.append('integrationId', body.integrationId);

  if (body.threadId) {
    formData.append('threadId', body.threadId);
  }

  if (body.context) {
    formData.append('Context', body.context);
  }

  body.files?.forEach((file) => {
    formData.append('files', file);
  });

  const { data } = await axiosInstance.post<MessageResponse>(
    '/chat/messages/send-initiator',
    formData,
  );

  return data;
};

export const sendMessageByButton = async (body: MessageButtonRequest): Promise<MessageResponse> => {
  const { data } = await axiosInstance.post('/chat/messages/send-initiator-by-button', body);

  return data;
};
