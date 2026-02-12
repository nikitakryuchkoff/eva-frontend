import { axiosInstance } from '@/shared/api';
import { IntegrationsResponse } from './types';

export const fetchIntegrations = async () => {
  const { data } = await axiosInstance.get<IntegrationsResponse>(
    '/eva/api/ChatBot/integrations',
  );

  return data;
};
