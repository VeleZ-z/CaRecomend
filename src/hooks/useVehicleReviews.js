import { useQuery } from '@tanstack/react-query';
import { getVehicleReviews } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const useVehicleReviews = (vehicleId) =>
  useQuery({
    queryKey: queryKeys.vehicleReviews(vehicleId),
    queryFn: () => getVehicleReviews(vehicleId),
    enabled: Boolean(vehicleId),
  });

export default useVehicleReviews;
