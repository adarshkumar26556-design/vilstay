import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    getAllBookings(params)
      .then(r => { setBookings(r.data.bookings); setPages(r.data.pages); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, statusFilter]);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const statusBadge = (s) => {
    const base = 'badge capitalize';
    if (s === 'confirmed') return `${base} badge-green`;
    if (s === 'pending') return `${base} badge-yellow`;
    return `${base} badge-red`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Manage Bookings</h1><p className="text-gray-400 text-sm mt-1">{total} total bookings</p></div>
        <select className="input-field max-w-xs" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3">Booking ID</th>
                  <th className="text-left px-5 py-3">Guest</th>
                  <th className="text-left px-5 py-3">Resort / Room</th>
                  <th className="text-left px-5 py-3">Dates</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{b.bookingId}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{b.user?.name || b.guestDetails?.name}</p>
                      <p className="text-xs text-gray-400">{b.user?.email}</p>
                      {b.user?.phone && <p className="text-xs text-gray-400">{b.user.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{b.resort?.name}</p>
                      <p className="text-xs text-gray-400">{b.room?.name} — {b.room?.type}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs">
                      <p>{formatDate(b.checkIn)} →</p>
                      <p>{formatDate(b.checkOut)}</p>
                      <p className="text-gray-400">{b.nights} night{b.nights > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{formatPrice(b.totalAmount)}</td>
                    <td className="px-5 py-4"><span className={statusBadge(b.status)}>{b.status}</span></td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        disabled={updating === b._id}
                        onChange={e => handleStatusChange(b._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No bookings found</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Page {page} of {pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><FiChevronLeft size={16} /></button>
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><FiChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
