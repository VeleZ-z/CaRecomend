import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { logout, selectCurrentUser } from '../../store/userSlice';

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
              CaRecom
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
                    Preferencias: {currentUser.preferences || 'Sin definir'}
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
