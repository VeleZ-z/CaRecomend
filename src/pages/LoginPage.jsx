import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/userSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.password.trim()) {
      setError('Por favor ingresa tu nombre y contraseña (simulada).');
      return;
    }

    dispatch(
      login({
        id: `user-${form.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: form.name,
        preferences: 'SUV familiar, seguridad, tecnología',
      }),
    );
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl backdrop-blur">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Bienvenido a</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">CaRecom</h1>
          <p className="mt-3 text-sm text-slate-300">Identifícate para obtener recomendaciones personalizadas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-slate-200">
              Nombre de usuario
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. María"
              className="mt-2 w-full rounded-2xl border border-transparent bg-white/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/60 focus:bg-white/30"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-200">
              Contraseña (simulada)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="******"
              className="mt-2 w-full rounded-2xl border border-transparent bg-white/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/60 focus:bg-white/30"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-300">
          El inicio de sesión es una simulación. Tus credenciales se almacenan localmente con Redux Toolkit.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
