import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/vehicleApi';
import { queryKeys } from '../api/queryKeys';

const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  });

export default useCategories;
