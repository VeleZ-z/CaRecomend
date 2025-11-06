import RatingStars from '../common/RatingStars';

const ReviewCard = ({ review }) => {
  const { userName, comment, rating } = review;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-500">Propietario verificado</p>
        </div>
        <RatingStars value={rating} />
      </header>
      <p className="mt-4 text-sm text-slate-600">{comment}</p>
    </article>
  );
};

export default ReviewCard;
