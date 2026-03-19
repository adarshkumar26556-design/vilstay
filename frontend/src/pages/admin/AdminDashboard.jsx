import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResorts, getAllBookings } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiTrendingUp, FiUsers, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ resorts: 0, bookings: 0, revenue: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getResorts({ limit: 100 }), getAllBookings({ limit: 5 })])
      .then(([rr, br]) => {
        const allBooks = br.data.bookings || [];
        const revenue = allBooks.reduce((s, b) => s + (b.status !== 'cancelled' ? b.totalAmount : 0), 0);
        const pending = allBooks.filter((b) => b.status === 'pending').length;
        setStats({ resorts: rr.data.total, bookings: br.data.total, revenue, pending });
        setRecentBookings(allBooks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { icon: <MdHotel size={24} />, label: 'Total Resorts', value: stats.resorts, color: 'bg-blue-50 text-primary-600', link: '/admin/resorts' },
    { icon: <FiCalendar size={22} />, label: 'Total Bookings', value: stats.bookings, color: 'bg-green-50 text-green-600', link: '/admin/bookings' },
    { icon: <FiTrendingUp size={22} />, label: 'Pending Approvals', value: stats.pending, color: 'bg-amber-50 text-amber-600', link: '/admin/bookings' },
    { icon: <FiDollarSign size={22} />, label: 'Total Revenue', value: formatPrice(stats.revenue), color: 'bg-purple-50 text-purple-600' },
  ];

  if (loading) return <div className="p-10"><LoadingSpinner /></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your resort business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card p-6">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>{s.icon}</div>
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            {s.link && <Link to={s.link} className="text-xs text-primary-600 font-semibold mt-2 inline-block hover:underline">View all →</Link>}
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-primary-600 font-semibold hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-6 py-3">Booking ID</th>
                <th className="text-left px-6 py-3">Guest</th>
                <th className="text-left px-6 py-3">Resort</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{b.bookingId}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{b.user?.name || b.guestDetails?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{b.resort?.name}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(b.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge capitalize ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
