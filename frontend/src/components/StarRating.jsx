import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, count, size = 'sm' }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const iconSize = size === 'lg' ? 'text-lg' : 'text-sm';

  for (let i = 0; i < full; i++) stars.push(<FaStar key={`f${i}`} className={`text-amber-400 ${iconSize}`} />);
  if (half) stars.push(<FaStarHalfAlt key="h" className={`text-amber-400 ${iconSize}`} />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`e${i}`} className={`text-amber-300 ${iconSize}`} />);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className={`font-semibold text-gray-800 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-gray-400 text-xs">({count} reviews)</span>}
    </div>
  );
}
