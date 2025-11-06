import axiosClient from './axiosClient';
import { mockVehicleApi } from './mockService';

const shouldUseMock = import.meta.env?.VITE_USE_MOCKS !== 'false';

export const getVehicles = async (filters) => {
  if (shouldUseMock) {
    return mockVehicleApi.getVehicles(filters);
  }
  const { data } = await axiosClient.get('/vehiculos', { params: filters });
  return data;
};

export const getVehicleById = async (vehicleId) => {
  if (shouldUseMock) {
    return mockVehicleApi.getVehicleById(vehicleId);
  }
  const { data } = await axiosClient.get(`/vehiculos/${vehicleId}`);
  return data;
};

export const getVehicleReviews = async (vehicleId) => {
  if (shouldUseMock) {
    return mockVehicleApi.getVehicleReviews(vehicleId);
  }
  const { data } = await axiosClient.get(`/vehiculos/${vehicleId}/resenas`);
  return data;
};

export const getCategories = async () => {
  if (shouldUseMock) {
    return mockVehicleApi.getCategories();
  }
  const { data } = await axiosClient.get('/categorias');
  return data;
};

export const getVehicleRecommendation = async ({ vehicleId, preferences }) => {
  if (shouldUseMock) {
    return mockVehicleApi.getRecommendation({ vehicleId, preferences });
  }
  const { data } = await axiosClient.post(`/vehiculos/${vehicleId}/recomendaciones`, {
    preferencias: preferences,
  });
  return data;
};

export const getPreferenceRecommendations = async (preferences) => {
  if (shouldUseMock) {
    return mockVehicleApi.getRecommendationsByPreferences(preferences);
  }
  const { data } = await axiosClient.post('/recomendaciones', {
    preferencias: preferences,
  });
  return data;
};
