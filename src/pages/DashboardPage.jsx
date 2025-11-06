import { useState } from 'react';
import VehicleFilters from '../components/dashboard/VehicleFilters';
import VehicleList from '../components/dashboard/VehicleList';
import useVehicles from '../hooks/useVehicles';
import useCategories from '../hooks/useCategories';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryId: '',
  });

  const {
    data: vehicles = [],
    isLoading,
    isError,
    refetch,
  } = useVehicles(filters);

  const { data: categories = [] } = useCategories();

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-primary/90 via-primary to-primary/80 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Explorar</p>
        <h1 className="mt-2 text-3xl font-semibold">
          Hola {currentUser?.name ?? 'conductor'}, descubre vehículos para ti
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/90">
          Filtra por categoría o palabra clave, revisa las calificaciones de otros usuarios y encuentra el vehículo ideal según tus preferencias.
        </p>
      </header>

      <VehicleFilters filters={filters} categories={categories} onFiltersChange={setFilters} />

      <VehicleList
        vehicles={vehicles}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
};

export default DashboardPage;
