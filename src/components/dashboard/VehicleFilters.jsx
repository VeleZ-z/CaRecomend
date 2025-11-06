const VehicleFilters = ({ filters, categories, onFiltersChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      searchTerm: '',
      categoryId: '',
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="searchTerm" className="block text-sm font-semibold text-slate-600">
            Buscar vehículo
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-primary">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-slate-400"
              aria-hidden="true"
            >
              <path
                d="M10.5 3a7.5 7.5 0 015.92 12.1l3.24 3.24a1 1 0 01-1.42 1.42l-3.24-3.24A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
                fill="currentColor"
              />
            </svg>
            <input
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Nombre, marca, modelo o característica"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full md:w-56">
          <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-600">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todas</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
};

export default VehicleFilters;
