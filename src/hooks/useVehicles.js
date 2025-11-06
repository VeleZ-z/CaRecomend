import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const useVehicles = (filters) => {
  const params = useMemo(
    () => ({
      categoryId: filters?.categoryId ?? '',
      searchTerm: filters?.searchTerm ?? '',
    }),
    [filters?.categoryId, filters?.searchTerm],
  );

  return useQuery({
    queryKey: [...queryKeys.vehicles, params],
    queryFn: () => getVehicles(params),
  });
};

export default useVehicles;
