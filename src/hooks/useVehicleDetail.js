import { useQuery } from '@tanstack/react-query';
import { getVehicleById } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const useVehicleDetail = (vehicleId) =>
  useQuery({
    queryKey: queryKeys.vehicle(vehicleId),
    queryFn: () => getVehicleById(vehicleId),
    enabled: Boolean(vehicleId),
  });

export default useVehicleDetail;
