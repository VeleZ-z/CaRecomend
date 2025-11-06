import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { defaultPreferences, updatePreferences } from '../store/userSlice';

const propulsionOptions = [
  { value: 0, label: 'Combustible (0)' },
  { value: 1, label: 'Híbrido (1)' },
  { value: 2, label: 'Eléctrico (2)' },
];

const noiseOptions = [
  { value: 'silencioso', label: 'Bajo (cabina silenciosa)' },
  { value: 'equilibrado', label: 'Medio (balanceado)' },
  { value: 'alto', label: 'Alto (motor ruidoso)' },
];

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [preferences, setPreferences] = useState(() => ({
    ...defaultPreferences,
    ...(currentUser?.preferences ?? {}),
  }));
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setPreferences({
      ...defaultPreferences,
      ...(currentUser?.preferences ?? {}),
    });
  }, [currentUser]);

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

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    const processedValue = name === 'propulsion' ? Number(value) : value;
    setPreferences((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    const numericValue = Number(value);

    setPreferences((prev) => {
      if (Number.isNaN(numericValue)) return prev;

      const next = {
        ...prev,
        [name]:
          name === 'cantidadPasajeros'
            ? Math.max(1, Math.floor(numericValue))
            : Math.max(0, numericValue),
      };

      if (name === 'precioMin' && next.precioMax < next.precioMin) {
        next.precioMax = next.precioMin;
      }

      if (name === 'precioMax' && next.precioMax < next.precioMin) {
        next.precioMin = next.precioMax;
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      updatePreferences({
        ...preferences,
        propulsion: Number(preferences.propulsion),
        cantidadPasajeros: Number(preferences.cantidadPasajeros),
        precioMin: Number(preferences.precioMin),
        precioMax: Number(preferences.precioMax),
      }),
    );
    setFeedback('Preferencias actualizadas. Estas variables alimentarán el motor de recomendaciones.');
    setTimeout(() => setFeedback(''), 2500);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Tu espacio</p>
        <h1 className="mt-2 text-3xl font-semibold">Perfil de {currentUser.name}</h1>
        <p className="mt-4 text-sm text-white/80">
          Configura el estilo de uso que deseas. Estas preferencias se enviarán junto a la solicitud para obtener vehículos recomendados.
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

          <fieldset className="rounded-2xl border border-slate-200 bg-white p-6">
            <legend className="px-2 text-sm font-semibold text-slate-700">Comportamiento de manejo</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="esRural"
                  checked={Boolean(preferences.esRural)}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  Uso rural
                  <span className="mt-1 block text-xs text-slate-500">
                    Necesito buen desempeño en vías destapadas o rurales.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="esManual"
                  checked={Boolean(preferences.esManual)}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  Transmisión manual
                  <span className="mt-1 block text-xs text-slate-500">
                    Prefiero vehículos con caja mecánica.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="cantidadPasajeros" className="text-sm font-semibold text-slate-700">
                Cantidad mínima de pasajeros
              </label>
              <input
                id="cantidadPasajeros"
                name="cantidadPasajeros"
                type="number"
                min={1}
                value={preferences.cantidadPasajeros}
                onChange={handleNumberChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="propulsion" className="text-sm font-semibold text-slate-700">
                Propulsión del vehículo
              </label>
              <select
                id="propulsion"
                name="propulsion"
                value={String(preferences.propulsion)}
                onChange={handleSelectChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {propulsionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="rangoRuido" className="text-sm font-semibold text-slate-700">
                Rango aceptable de ruido
              </label>
              <select
                id="rangoRuido"
                name="rangoRuido"
                value={preferences.rangoRuido}
                onChange={handleSelectChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {noiseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Rango de precios objetivo (USD)
              </label>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <input
                  type="number"
                  id="precioMin"
                  name="precioMin"
                  min={0}
                  value={preferences.precioMin}
                  onChange={handleNumberChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  id="precioMax"
                  name="precioMax"
                  min={0}
                  value={preferences.precioMax}
                  onChange={handleNumberChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Máximo"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                El sistema filtrará vehículos cuyo precio estimado esté dentro de este rango.
              </p>
            </div>
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
          <h2 className="text-lg font-semibold text-slate-900">Variables que guardamos</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              <span>
                <strong>Uso Rural / Transmision manual:</strong> booleanos que indican tu preferencia por caminos rurales y transmisión manual.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              <span>
                <strong>cantidad de pasajeros:</strong> número mínimo de ocupantes que necesitas transportar.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              <span>
                <strong>ruido / rango de precios:</strong> parámetros cuantificables para cruzar contra los datos los de vehículos.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
              <span>
                <strong>propulsion:</strong> indica sistema de propulsion para el vehiculo: combustible, híbrido o eléctrico.
              </span>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default ProfilePage;
