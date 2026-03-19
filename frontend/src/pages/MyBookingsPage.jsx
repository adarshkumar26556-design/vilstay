import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/api';
import { formatPrice, formatDate, statusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiX, FiEye } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';
import { imgFallback } from '../utils/helpers';

const STATUS_TABS = ['all', 'confirmed', 'pending', 'cancelled'];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    getMyBookings()
      .then((r) => setBookings(r.data))
      .catch(() => toast.error('Could not load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="page-container">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-400 mb-6">Manage and track all your resort stays</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-primary-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t} {t === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === t).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your bookings..." />
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <MdHotel size={56} className="mx-auto mb-4 text-gray-200" />
            <h3 className="font-bold text-gray-700 mb-2">No bookings {activeTab !== 'all' ? `with status "${activeTab}"` : 'yet'}</h3>
            <p className="text-gray-400 text-sm mb-6">Ready for your next getaway?</p>
            <Link to="/resorts" className="btn-primary inline-block">Explore Resorts</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div key={booking._id} className="card flex flex-col md:flex-row overflow-hidden group">
                {/* Image */}
                <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                  <img
                    src={booking.resort?.images?.[0]?.url || ''}
                    alt={booking.resort?.name}
                    onError={imgFallback}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{booking.resort?.name}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                          <FiMapPin size={11} />
                          <span>{booking.resort?.location?.city}, {booking.resort?.location?.state}</span>
                        </div>
                      </div>
                      <span className={statusColor(booking.status)}>{booking.status}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{booking.room?.name} — <span className="text-gray-400">{booking.room?.type}</span></p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5"><FiCalendar size={13} className="text-gray-400" />{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                      <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                      <span>{booking.guests?.adults + (booking.guests?.children || 0)} guests</span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">Booking ID: <span className="font-mono font-semibold text-gray-600">{booking.bookingId}</span></p>
                  </div>

                  <div className="flex flex-col items-end md:items-end gap-3 md:min-w-36">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-primary-600">{formatPrice(booking.totalAmount)}</div>
                      <div className="text-xs text-gray-400">total</div>
                    </div>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancelling === booking._id}
                        className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all border border-red-100"
                      >
                        <FiX size={14} /> {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
