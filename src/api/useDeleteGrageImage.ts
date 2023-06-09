import { BaseMutationApiOptions } from '@/types';

import { useBaseMutationApi } from './useBaseMutationApi';

export function useDeleteGrageImage(options?: BaseMutationApiOptions<string>) {
  return useBaseMutationApi({
    method: 'DELETE',
    endpoint: '/api/Garage/removeImage',
    ...options,
  });
}
