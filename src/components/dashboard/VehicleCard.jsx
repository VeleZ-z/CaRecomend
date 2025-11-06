import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';

const VehicleCard = ({ vehicle }) => {
  const { id, name, brand, model, year, avgRating, description, features = [], tags = [] } = vehicle;

  return (
    <article
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
      aria-label={`${name} ${year}`}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">#{brand}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-500">{model} - {year}</p>
        </div>
        <RatingStars value={avgRating} />
      </header>

      <p className="mt-4 text-sm text-slate-600">{description}</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary/70" />
            {feature}
          </li>
        ))}
      </ul>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/vehiculo/${id}`}
          className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-white"
        >
          Ver detalles
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path
              d="M13.5 5.5l5.5 5.5-5.5 5.5M6 11h12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </footer>
    </article>
  );
};

export default VehicleCard;
