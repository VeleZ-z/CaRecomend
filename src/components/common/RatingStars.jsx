import { memo, useId } from 'react';

const Star = memo(({ fillFraction }) => {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillFraction * 100}%`} stopColor="#eab308" />
          <stop offset={`${fillFraction * 100}%`} stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l2.93 6.318 6.866.545-5.19 4.508 1.55 6.629L12 16.91 5.84 20l1.55-6.629-5.19-4.508 6.866-.545z"
        fill={`url(#${gradientId})`}
        stroke="#eab308"
        strokeWidth="1"
      />
    </svg>
  );
});

const RatingStars = ({ value }) => {
  const ratingValue = Number(value ?? 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const fillFraction = Math.max(0, Math.min(1, ratingValue - index));
        return <Star key={index} fillFraction={fillFraction} />;
      })}
      <span className="text-sm font-medium text-slate-600">{ratingValue ? ratingValue.toFixed(1) : 'N/A'}</span>
    </div>
  );
};

export default RatingStars;
