import { categories, reviews, vehicles } from '../mocks/mockData';

const clone = (data) => (data === undefined ? undefined : JSON.parse(JSON.stringify(data)));

const simulateDelay = async (result, ms = 400) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(clone(result)), ms);
  });

const normaliseText = (value = '') => value.toString().toLowerCase().trim();

const getVehicleAverage = (vehicleId) => {
  const vehicleReviews = reviews.filter((review) => review.vehicleId === vehicleId);
  if (!vehicleReviews.length) return null;
  const total = vehicleReviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / vehicleReviews.length).toFixed(1));
};

const parsePreferences = (preferences) =>
  normaliseText(preferences)
    .split(/[,#]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

export const mockVehicleApi = {
  async getVehicles(filters = {}) {
    const { categoryId, searchTerm } = filters;
    const search = normaliseText(searchTerm);

    const filteredVehicles = vehicles
      .map((vehicle) => ({
        ...vehicle,
        avgRating: getVehicleAverage(vehicle.id) ?? vehicle.avgRating ?? 0,
      }))
      .filter((vehicle) => {
        const matchesCategory = categoryId ? vehicle.categoryId === categoryId : true;
        if (!matchesCategory) return false;

        if (!search) return true;

        const haystack = [
          vehicle.name,
          vehicle.brand,
          vehicle.model,
          vehicle.description,
          ...(vehicle.tags ?? []),
          ...(vehicle.features ?? []),
        ]
          .map(normaliseText)
          .join(' ');

        return haystack.includes(search);
      });

    return simulateDelay(filteredVehicles);
  },

  async getVehicleById(vehicleId) {
    const vehicle = vehicles.find((item) => item.id === vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }
    return simulateDelay({
      ...vehicle,
      avgRating: getVehicleAverage(vehicleId) ?? vehicle.avgRating ?? 0,
    });
  },

  async getVehicleReviews(vehicleId) {
    const vehicleReviews = reviews
      .filter((review) => review.vehicleId === vehicleId)
      .sort((a, b) => b.rating - a.rating);

    return simulateDelay(vehicleReviews);
  },

  async getCategories() {
    return simulateDelay(categories);
  },

  async getRecommendation({ vehicleId, preferences }) {
    const sourceVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
    if (!sourceVehicle) {
      throw new Error('Vehículo base no encontrado');
    }

    const preferenceTokens = parsePreferences(preferences);

    const candidates = vehicles.filter((vehicle) => vehicle.id !== vehicleId);

    const scored = candidates
      .map((vehicle) => {
        let score = 0;

        if (vehicle.categoryId === sourceVehicle.categoryId) {
          score += 3;
        }

        const tags = vehicle.tags ?? [];
        const features = vehicle.features ?? [];

        const tagMatches = tags.filter((tag) => preferenceTokens.includes(normaliseText(tag))).length;
        score += tagMatches * 2;

        const featureMatches = features.filter((feature) =>
          preferenceTokens.some((token) => normaliseText(feature).includes(token)),
        ).length;
        score += featureMatches;

        score += (vehicle.avgRating ?? getVehicleAverage(vehicle.id) ?? 0) / 5;

        return {
          vehicle,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    const best = scored.slice(0, 2).map((item) => item.vehicle);

    return simulateDelay(best);
  },
};
