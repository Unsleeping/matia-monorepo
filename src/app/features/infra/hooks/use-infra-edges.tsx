import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../lib/fetcher';

export const useInfraEdges = () => {
  return useQuery({
    queryKey: ['infra-edges'],
    queryFn: () => fetcher.getEdges(),
  });
};
