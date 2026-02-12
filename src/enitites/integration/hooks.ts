import { QUERY_KEYS } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { fetchIntegrations } from './api';
import { INTEGRATIONS_STORAGE_KEY } from './consts';
import { Integration } from '.';

interface Props {
  onIntegrationSelect: (integration: Integration) => void;
}

export const useFetchIntegrations = ({ onIntegrationSelect }: Props) => {
  const { data, isFetching: isIntegrationsLoading } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_INTAGRATIONS],
    queryFn: async () => {
      const data = await fetchIntegrations();
      const storedId = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);

      if (storedId) {
        const found = data.entities.find((i) => i.id === storedId);
        if (found) {
          onIntegrationSelect(found);
          return data;
        }
      }

      const defaultIntegration = data.entities.find((i) => i.default) ?? data.entities[0];

      if (defaultIntegration) {
        onIntegrationSelect(defaultIntegration);
        localStorage.setItem(INTEGRATIONS_STORAGE_KEY, defaultIntegration.id);
      }

      return data;
    },
  });

  const integrations = data?.entities.map((el) => ({ ...el, title: el.title.toUpperCase() }));

  return { integrations: integrations ?? [], isIntegrationsLoading };
};
