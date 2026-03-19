import { Link } from 'react-router-dom';
import { FiMapPin, FiWifi, FiDroplet } from 'react-icons/fi';
import { MdOutlineFreeBreakfast, MdLocalParking } from 'react-icons/md';
import { FaSwimmingPool } from 'react-icons/fa';
import StarRating from './StarRating';
import { formatPrice, truncate, imgFallback } from '../utils/helpers';

const amenityIcon = (a) => {
  if (a.toLowerCase().includes('wifi')) return <FiWifi className="text-gray-400" title={a} />;
  if (a.toLowerCase().includes('pool')) return <FaSwimmingPool className="text-gray-400" title={a} />;
  if (a.toLowerCase().includes('parking')) return <MdLocalParking className="text-gray-400" title={a} />;
  if (a.toLowerCase().includes('breakfast')) return <MdOutlineFreeBreakfast className="text-gray-400" title={a} />;
  if (a.toLowerCase().includes('water')) return <FiDroplet className="text-gray-400" title={a} />;
  return null;
};

const categoryColors = {
  luxury: 'bg-amber-50 text-amber-700',
  heritage: 'bg-orange-50 text-orange-700',
  eco: 'bg-green-50 text-green-700',
  boutique: 'bg-purple-50 text-purple-700',
  budget: 'bg-blue-50 text-blue-700',
};

export default function ResortCard({ resort }) {
  const image = resort.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
  const minPrice = resort.minPrice;

  return (
    <Link to={`/resorts/${resort._id}`} className="card group block overflow-hidden hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={resort.name}
          onError={imgFallback}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[resort.category] || 'bg-gray-100 text-gray-700'}`}>
          {resort.category}
        </span>
        {resort.featured && (
          <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-1">
            {resort.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <FiMapPin size={12} />
          <span>{resort.location?.city}, {resort.location?.state}</span>
        </div>

        <StarRating rating={resort.rating || 0} count={resort.reviewCount} />

        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{truncate(resort.shortDescription || resort.description, 90)}</p>

        {/* Amenities */}
        {resort.amenities?.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {resort.amenities.slice(0, 5).map((a, i) => {
              const icon = amenityIcon(a);
              return icon ? (
                <span key={i} className="text-gray-400 text-sm" title={a}>{icon}</span>
              ) : (
                <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400">Starting from</span>
            <div className="font-bold text-primary-600 text-lg">
              {minPrice ? formatPrice(minPrice) : 'View Rooms'}
              <span className="text-gray-400 text-xs font-normal">/night</span>
            </div>
          </div>
          <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg font-semibold">View →</span>
        </div>
      </div>
    </Link>
  );
}
