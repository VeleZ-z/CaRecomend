import { Link } from 'react-router-dom';
import VehicleList from '../components/dashboard/VehicleList';
import usePreferenceRecommendations from '../hooks/usePreferenceRecommendations';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const preferences = currentUser?.preferences;
  const hasPreferences = Boolean(preferences);

  const {
    data: recommendedVehicles = [],
    isLoading,
    isError,
    refetch,
  } = usePreferenceRecommendations(hasPreferences ? preferences : null);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-primary/90 via-primary to-primary/80 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Explorar</p>
        <h1 className="mt-2 text-3xl font-semibold">
          Hola {currentUser?.name ?? 'conductor'}, descubre vehículos para ti
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/90">
          Tus recomendaciones se generan automáticamente con los parámetros definidos en el perfil.
        </p>
      </header>

      {hasPreferences ? (
        <VehicleList
          vehicles={recommendedVehicles}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-primary/50 bg-white/80 p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Configura tus preferencias</h2>
          <p className="mt-3 text-sm text-slate-600">
            Completa el formulario del perfil para generar recomendaciones personalizadas.
          </p>
          <Link
            to="/perfil"
            className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            Ir al perfil
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
