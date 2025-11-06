export const queryKeys = {
  vehicles: ['vehicles'],
  vehicle: (id) => ['vehicles', id],
  vehicleReviews: (vehicleId) => ['vehicles', vehicleId, 'reviews'],
  categories: ['categories'],
  recommendation: (vehicleId) => ['vehicles', vehicleId, 'recommendation'],
  preferenceRecommendations: (preferences) => ['recommendations', 'preferences', preferences],
};
