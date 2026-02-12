import { MessageTitleRequest } from '@/enitites/message';
import { QUERY_KEYS } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { fetchImage } from '../api';

export const useGeneratedImage = (requestData: MessageTitleRequest) => {
  const imageId = requestData.urlParams.find((p) => p.name === 'uuid')?.value ?? null;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GENERATED_IMAGE, '-', imageId],
    queryFn: () => fetchImage(requestData),
    enabled: !!imageId,
  });

  return {
    imageData: data,
    isLoading,
    error,
    refetch,
  };
};
