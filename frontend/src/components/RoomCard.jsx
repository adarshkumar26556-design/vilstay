import { Link } from 'react-router-dom';
import { FiUsers, FiArrowRight, FiWifi, FiDroplet } from 'react-icons/fi';
import { MdAcUnit, MdOutlineBed } from 'react-icons/md';
import { FaSwimmingPool } from 'react-icons/fa';
import { formatPrice } from '../utils/helpers';
import { imgFallback } from '../utils/helpers';

const amenityIcon = (a) => {
  const lc = a.toLowerCase();
  if (lc.includes('ac') || lc.includes('air')) return <MdAcUnit title={a} />;
  if (lc.includes('wifi')) return <FiWifi title={a} />;
  if (lc.includes('pool')) return <FaSwimmingPool title={a} />;
  if (lc.includes('water') || lc.includes('hot')) return <FiDroplet title={a} />;
  return null;
};

const typeColors = {
  'AC': 'bg-blue-50 text-blue-700',
  'Non-AC': 'bg-gray-100 text-gray-600',
  'Deluxe': 'bg-amber-50 text-amber-700',
  'Suite': 'bg-purple-50 text-purple-700',
  'Villa': 'bg-green-50 text-green-700',
  'Cottage': 'bg-orange-50 text-orange-700',
};

export default function RoomCard({ room, resortId }) {
  const img = room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
  return (
    <div className="card flex flex-col md:flex-row overflow-hidden group hover:-translate-y-0.5 transition-all duration-200">
      <div className="md:w-52 h-44 md:h-auto flex-shrink-0 overflow-hidden">
        <img src={img} alt={room.name} onError={imgFallback}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[room.type] || 'bg-gray-100 text-gray-600'}`}>{room.type}</span>
            <h3 className="font-bold text-gray-900 text-lg mt-1">{room.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-extrabold text-primary-600">{formatPrice(room.pricePerNight)}</div>
            <div className="text-gray-400 text-xs">per night</div>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{room.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1.5"><FiUsers size={14} className="text-gray-400" />{room.capacity?.adults} Adults</span>
          {room.capacity?.children > 0 && <span>{room.capacity.children} Children</span>}
          <span className="flex items-center gap-1.5"><MdOutlineBed size={15} className="text-gray-400" />Bed Included</span>
        </div>

        {/* Amenities */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 6).map((a, i) => {
              const icon = amenityIcon(a);
              return (
                <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-gray-100">
                  {icon && <span className="text-gray-400">{icon}</span>}
                  {a}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-auto">
          <Link
            to={`/booking/${room._id}?resort=${resortId}`}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            Book Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
