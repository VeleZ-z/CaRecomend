import { categories, reviews, vehicles } from '../mocks/mockData';

const clone = (data) => (data === undefined ? undefined : JSON.parse(JSON.stringify(data)));

const simulateDelay = async (result, ms = 400) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(clone(result)), ms);
  });

const normaliseText = (value = '') => value.toString().toLowerCase().trim();

const propulsionLabels = {
  0: 'combustible',
  1: 'híbrido',
  2: 'eléctrico',
};

const noiseRanking = {
  silencioso: 1,
  equilibrado: 2,
  alto: 3,
};

const defaultPreferenceProfile = {
  esRural: false,
  esManual: false,
  cantidadPasajeros: 5,
  rangoRuido: 'equilibrado',
  precioMin: 25000,
  precioMax: 45000,
  propulsion: 0,
};

const getVehicleAverage = (vehicleId) => {
  const vehicleReviews = reviews.filter((review) => review.vehicleId === vehicleId);
  if (!vehicleReviews.length) return null;
  const total = vehicleReviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / vehicleReviews.length).toFixed(1));
};

const buildPreferenceTokens = (structured, raw) => {
  const tokens = [];

  if (structured.esRural) {
    tokens.push('rural', 'off-road');
  } else {
    tokens.push('urbano', 'ciudad');
  }

  if (structured.esManual) {
    tokens.push('manual', 'mecánico');
  } else {
    tokens.push('automático');
  }

  tokens.push(`pasajeros-${structured.cantidadPasajeros}`);
  tokens.push(structured.rangoRuido);
  const propulsionLabel = propulsionLabels[structured.propulsion];
  if (propulsionLabel) {
    tokens.push(propulsionLabel);
  }

  const rawNotes = [];
  if (Array.isArray(raw?.keywords)) {
    rawNotes.push(...raw.keywords);
  }
  if (typeof raw?.texto === 'string') {
    rawNotes.push(...raw.texto.split(/[,\s]+/));
  }
  if (typeof raw?.notas === 'string') {
    rawNotes.push(...raw.notas.split(/[,\s]+/));
  }
  if (typeof raw?.tags === 'string') {
    rawNotes.push(...raw.tags.split(/[,\s]+/));
  }

  return tokens.concat(
    rawNotes
      .map(normaliseText)
      .filter(Boolean),
  );
};

const normalisePreferences = (preferences) => {
  if (!preferences) {
    return {
      structured: { ...defaultPreferenceProfile },
      tokens: [],
    };
  }

  if (typeof preferences === 'string') {
    const tokens = normaliseText(preferences)
      .split(/[,#\s]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    return {
      structured: { ...defaultPreferenceProfile },
      tokens,
    };
  }

  const structured = {
    ...defaultPreferenceProfile,
    ...preferences,
  };

  structured.esRural = Boolean(structured.esRural);
  structured.esManual = Boolean(structured.esManual);
  structured.propulsion = Number.isNaN(Number(structured.propulsion))
    ? defaultPreferenceProfile.propulsion
    : Number(structured.propulsion);
  structured.cantidadPasajeros = Number.isNaN(Number(structured.cantidadPasajeros))
    ? defaultPreferenceProfile.cantidadPasajeros
    : Number(structured.cantidadPasajeros);
  structured.rangoRuido = structured.rangoRuido ?? defaultPreferenceProfile.rangoRuido;
  structured.precioMin = Number.isNaN(Number(structured.precioMin))
    ? defaultPreferenceProfile.precioMin
    : Number(structured.precioMin);
  structured.precioMax = Number.isNaN(Number(structured.precioMax))
    ? defaultPreferenceProfile.precioMax
    : Number(structured.precioMax);
  if (structured.precioMax < structured.precioMin) {
    structured.precioMax = structured.precioMin;
  }

  return {
    structured,
    tokens: buildPreferenceTokens(structured, preferences),
  };
};

const scoreVehicleWithPreferences = ({ vehicle, structured, tokenList, baseCategoryId }) => {
  let score = 0;

  if (baseCategoryId && vehicle.categoryId === baseCategoryId) {
    score += 2.5;
  }

  if (structured.esRural === vehicle.esRural) {
    score += 3;
  } else {
    score -= 1;
  }

  if (structured.esManual === vehicle.esManual) {
    score += 2;
  } else {
    score -= 0.5;
  }

  if (structured.cantidadPasajeros) {
    if (vehicle.cantidadPasajeros >= structured.cantidadPasajeros) {
      score += 2;
    } else {
      score -= 1.5;
    }
  }

  if (structured.propulsion === vehicle.propulsion) {
    score += 4;
  } else {
    score -= 1;
  }

  const noiseDiff = Math.abs(
    (noiseRanking[vehicle.rangoRuido] ?? 0) - (noiseRanking[structured.rangoRuido] ?? 0),
  );
  score += Math.max(0, 2 - noiseDiff);

  if (typeof vehicle.precio === 'number') {
    if (vehicle.precio >= structured.precioMin && vehicle.precio <= structured.precioMax) {
      score += 3.5;
    } else {
      const distance = Math.min(
        Math.abs(vehicle.precio - structured.precioMin),
        Math.abs(vehicle.precio - structured.precioMax),
      );
      score -= Math.min(2, distance / 10_000);
    }
  }

  if (tokenList.length) {
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

    tokenList.forEach((token) => {
      if (token && haystack.includes(token)) {
        score += 0.75;
      }
    });
  }

  const average = vehicle.avgRating ?? getVehicleAverage(vehicle.id) ?? 0;
  score += average / 5;

  return score;
};

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

    const { structured, tokens } = normalisePreferences(preferences);
    const tokenList = tokens.map(normaliseText);

    const candidates = vehicles.filter((vehicle) => vehicle.id !== vehicleId);

    const scored = candidates
      .map((vehicle) => ({
        vehicle,
        score: scoreVehicleWithPreferences({
          vehicle,
          structured,
          tokenList,
          baseCategoryId: sourceVehicle.categoryId,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored.slice(0, 2).map((item) => item.vehicle);

    return simulateDelay(best);
  },

  async getRecommendationsByPreferences(preferences) {
    const { structured, tokens } = normalisePreferences(preferences);
    const tokenList = tokens.map(normaliseText);

    const scored = vehicles
      .map((vehicle) => ({
        vehicle,
        score: scoreVehicleWithPreferences({
          vehicle,
          structured,
          tokenList,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored.slice(0, 6).map((entry) => ({
      ...entry.vehicle,
      avgRating: getVehicleAverage(entry.vehicle.id) ?? entry.vehicle.avgRating ?? 0,
    }));

    return simulateDelay(best);
  },
};
