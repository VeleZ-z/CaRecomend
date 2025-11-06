import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { logout, selectCurrentUser } from '../../store/userSlice';

const propulsionLabels = {
  0: 'Combustible',
  1: 'Híbrido',
  2: 'Eléctrico',
};

const noiseLabels = {
  silencioso: 'Ruido bajo',
  equilibrado: 'Ruido equilibrado',
  alto: 'Ruido alto',
};

const priceLabels = {
  economico: 'Precio económico',
  medio: 'Precio medio',
  premium: 'Precio premium',
};

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const formatPriceRange = (min, max) => {
  if (typeof min !== 'number' || typeof max !== 'number') return null;
  return `Precio ${priceFormatter.format(min)} - ${priceFormatter.format(max)}`;
};

const buildPreferencesSummary = (preferences) => {
  if (!preferences) return 'Sin definir';
  if (typeof preferences === 'string') return preferences;

  const mergedPreferences = {
    esRural: preferences.esRural ?? false,
    esManual: preferences.esManual ?? false,
    cantidadPasajeros: preferences.cantidadPasajeros,
    propulsion: preferences.propulsion,
    precioMin: typeof preferences.precioMin === 'number' ? preferences.precioMin : undefined,
    precioMax: typeof preferences.precioMax === 'number' ? preferences.precioMax : undefined,
    rangoPrecios: preferences.rangoPrecios,
    rangoRuido: preferences.rangoRuido,
  };

  const priceSegment =
    formatPriceRange(mergedPreferences.precioMin, mergedPreferences.precioMax) ??
    priceLabels[mergedPreferences.rangoPrecios];

  const segments = [
    mergedPreferences.esRural ? 'Uso rural' : 'Uso urbano',
    mergedPreferences.esManual ? 'Transmisión manual' : 'Transmisión automática',
    mergedPreferences.cantidadPasajeros ? `Pasajeros ≥ ${mergedPreferences.cantidadPasajeros}` : null,
    propulsionLabels[mergedPreferences.propulsion],
    priceSegment,
    noiseLabels[mergedPreferences.rangoRuido],
  ].filter(Boolean);

  return segments.join(' | ');
};

const MainLayout = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/dashboard" className="flex items-center gap-2 text-xl font-semibold text-primary">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium uppercase tracking-wide text-primary">
              CaRapp
            </span>
            <span className="hidden text-slate-600 sm:block">Recomendador de Vehículos</span>
          </NavLink>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-slate-100'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-slate-100'
                }`
              }
            >
              Perfil
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-700">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">
                    {buildPreferencesSummary(currentUser.preferences)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full border border-primary px-4 py-1 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
