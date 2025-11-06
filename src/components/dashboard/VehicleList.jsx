import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, isLoading, isError, onRetry }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white/60 p-6"
          >
            <div className="h-6 w-1/3 rounded-full bg-slate-200" />
            <div className="mt-2 h-4 w-1/4 rounded-full bg-slate-200" />
            <div className="mt-5 space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-200" />
              <div className="h-3 w-11/12 rounded-full bg-slate-200" />
              <div className="h-3 w-10/12 rounded-full bg-slate-200" />
            </div>
            <div className="mt-6 h-8 w-28 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-semibold">No pudimos cargar los vehículos</h3>
        <p className="mt-2 text-sm">
          Verifica tu conexión y vuelve a intentar. Si el problema persiste, comunícate con soporte.
        </p>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        ) : null}
      </div>
    );
  }

  if (!vehicles?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500">
        <h3 className="text-lg font-semibold text-slate-700">No hay vehículos para mostrar</h3>
        <p className="mt-2 text-sm">
          Ajusta los filtros o intenta con otra palabra clave para ver más opciones.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
