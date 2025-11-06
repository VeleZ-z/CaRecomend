import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPreferenceRecommendations } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const usePreferenceRecommendations = (preferences) => {
  const serialised = useMemo(() => JSON.stringify(preferences ?? {}), [preferences]);

  return useQuery({
    queryKey: queryKeys.preferenceRecommendations(serialised),
    queryFn: () => getPreferenceRecommendations(preferences),
    enabled: Boolean(preferences),
  });
};

export default usePreferenceRecommendations;
