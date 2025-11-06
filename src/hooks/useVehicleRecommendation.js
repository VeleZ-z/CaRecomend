import { useQuery } from '@tanstack/react-query';
import { getVehicleRecommendation } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const useVehicleRecommendation = ({ vehicleId, preferences, enabled }) =>
  useQuery({
    queryKey: [...queryKeys.recommendation(vehicleId), preferences],
    queryFn: () => getVehicleRecommendation({ vehicleId, preferences }),
    enabled: Boolean(vehicleId) && Boolean(preferences) && Boolean(enabled),
  });

export default useVehicleRecommendation;
