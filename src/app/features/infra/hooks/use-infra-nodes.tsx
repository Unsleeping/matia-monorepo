import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../lib/fetcher';

export const useInfraNodes = () => {
  return useQuery({
    queryKey: ['infra-nodes'],
    queryFn: () => fetcher.getNodes(),
  });
};
