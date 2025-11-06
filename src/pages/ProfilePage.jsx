import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updatePreferences } from '../store/userSlice';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [preferences, setPreferences] = useState(currentUser?.preferences ?? '');
  const [feedback, setFeedback] = useState('');

  if (!currentUser) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-600">
        <h2 className="text-2xl font-semibold text-slate-900">No estás autenticado</h2>
        <p className="mt-2 text-sm">
          Inicia sesión nuevamente para acceder a tu perfil y personalizar tus preferencias.
        </p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updatePreferences(preferences));
    setFeedback('Preferencias actualizadas. Usaremos esta información para afinar tus recomendaciones.');
    setTimeout(() => setFeedback(''), 2500);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Tu espacio</p>
        <h1 className="mt-2 text-3xl font-semibold">Perfil de {currentUser.name}</h1>
        <p className="mt-4 text-sm text-white/80">
          Ajusta tus preferencias para mejorar la precisión del motor de recomendaciones.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.7fr,1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-primary">Nombre</label>
            <p className="mt-2 text-lg font-semibold text-slate-900">{currentUser.name}</p>
          </div>

          <div>
            <label htmlFor="preferences" className="text-sm font-semibold text-slate-700">
              Preferencias de estilo de vida y vehículo
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Describe en palabras o etiquetas separadas por comas. Ejemplo: &quot;SUV, seguridad, viajes largos&quot;
            </p>
            <textarea
              id="preferences"
              name="preferences"
              value={preferences}
              onChange={(event) => setPreferences(event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            Guardar preferencias
          </button>

          {feedback ? (
            <p className="text-sm font-medium text-primary">
              {feedback}
            </p>
          ) : null}
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">¿Qué puedes guardar aquí?</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              Estilos de conducción (urbano, off-road, viajes largos, etc.).
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              Características deseadas como seguridad, eficiencia, conectividad o deportividad.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              Notas personales que quieras recordar al evaluar diferentes vehículos.
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default ProfilePage;
