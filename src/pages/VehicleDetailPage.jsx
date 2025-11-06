import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewCard from '../components/vehicle/ReviewCard';
import RatingStars from '../components/common/RatingStars';
import useVehicleDetail from '../hooks/useVehicleDetail';
import useVehicleReviews from '../hooks/useVehicleReviews';
import useVehicleRecommendation from '../hooks/useVehicleRecommendation';
import useAuth from '../hooks/useAuth';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [recommendationEnabled, setRecommendationEnabled] = useState(false);

  const {
    data: vehicle,
    isLoading,
    isError,
    refetch: refetchVehicle,
  } = useVehicleDetail(id);

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
  } = useVehicleReviews(id);

  const {
    data: recommendedVehicles = [],
    isFetching: recommendationLoading,
    refetch: fetchRecommendation,
  } = useVehicleRecommendation({
    vehicleId: id,
    preferences: currentUser?.preferences ?? '',
    enabled: recommendationEnabled,
  });

  const handleRecommend = async () => {
    if (!currentUser?.preferences) {
      setRecommendationEnabled(false);
      return;
    }
    setRecommendationEnabled(true);
    await fetchRecommendation();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-red-700">
        <h2 className="text-2xl font-semibold">No pudimos cargar el vehículo</h2>
        <p className="mt-2 text-sm">
          Intenta nuevamente o vuelve al listado principal para seleccionar otro vehículo.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={refetchVehicle}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
          <Link
            to="/dashboard"
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{vehicle.brand}</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              {vehicle.name}
            </h1>
            <p className="text-sm text-slate-600">
              Modelo {vehicle.model} - Año {vehicle.year}
            </p>
          </div>
          <RatingStars value={vehicle.avgRating} />
        </div>

        <p className="mt-6 max-w-3xl text-base text-slate-700">{vehicle.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(vehicle.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-900">Características clave</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            {vehicle.features?.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
          <h2 className="text-xl font-semibold">Recomendarme similar</h2>
          <p className="mt-2 text-sm text-white/70">
            Analizamos la categoría y tus preferencias para sugerirte alternativas comparables.
          </p>

          <button
            onClick={handleRecommend}
            disabled={!currentUser?.preferences || recommendationLoading}
            className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
          >
            {recommendationLoading ? 'Buscando opciones...' : 'Recomendar'}
          </button>

          {!currentUser?.preferences ? (
            <p className="mt-4 text-xs text-white/60">
              Define tus preferencias en el perfil para habilitar recomendaciones personalizadas.
            </p>
          ) : null}

          {recommendationEnabled ? (
            <div className="mt-6 space-y-4">
              {recommendationLoading ? (
                <div className="h-16 animate-pulse rounded-2xl bg-white/20" />
              ) : recommendedVehicles.length ? (
                recommendedVehicles.map((item) => (
                  <Link
                    to={`/vehiculo/${item.id}`}
                    key={item.id}
                    className="block rounded-2xl border border-white/20 bg-white/10 p-4 text-sm transition hover:border-white/40 hover:bg-white/20"
                  >
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-white/70">
                      {item.brand} - {item.model} - {item.year}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-white/70">
                  No encontramos coincidencias directas. Ajusta tus preferencias y vuelve a intentar.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Reseñas de otros usuarios</h2>
            <p className="text-sm text-slate-600">
              Opiniones reales de la comunidad sobre el {vehicle.name}.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M8.25 7.5L3.75 12l4.5 4.5M4.5 12h15.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver a explorar
          </Link>
        </div>

        {reviewsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : reviews.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            <h3 className="text-lg font-semibold text-slate-700">Aún no hay reseñas disponibles</h3>
            <p className="mt-2 text-sm">
              Sé el primero en compartir tu experiencia cuando el backend esté listo.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default VehicleDetailPage;
