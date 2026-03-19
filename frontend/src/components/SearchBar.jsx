import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
import { today, tomorrow } from '../utils/helpers';

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    search: '',
    checkIn: today(),
    checkOut: tomorrow(),
    guests: 2,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.search) params.set('search', form.search);
    if (form.checkIn) params.set('checkIn', form.checkIn);
    if (form.checkOut) params.set('checkOut', form.checkOut);
    if (form.guests) params.set('guests', form.guests);
    navigate(`/resorts?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl shadow-md p-2">
        <div className="flex items-center gap-2 flex-1 px-3">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search resorts or city..."
            value={form.search}
            onChange={(e) => set('search', e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
          />
        </div>
        <button type="submit" className="btn-primary py-2 px-5 text-sm">Search</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col lg:flex-row gap-2 w-full max-w-4xl">
      {/* Destination */}
      <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-xl px-4 py-3 min-w-0">
        <FiMapPin className="text-primary-500 flex-shrink-0 text-lg" />
        <div className="min-w-0 flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Destination</label>
          <input
            type="text"
            placeholder="Where do you want to stay?"
            value={form.search}
            onChange={(e) => set('search', e.target.value)}
            className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 lg:w-44">
        <FiCalendar className="text-primary-500 flex-shrink-0 text-lg" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Check-in</label>
          <input
            type="date"
            value={form.checkIn}
            min={today()}
            onChange={(e) => { set('checkIn', e.target.value); if (e.target.value >= form.checkOut) set('checkOut', e.target.value); }}
            className="bg-transparent outline-none text-gray-900 text-sm w-full"
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 lg:w-44">
        <FiCalendar className="text-primary-500 flex-shrink-0 text-lg" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Check-out</label>
          <input
            type="date"
            value={form.checkOut}
            min={form.checkIn || today()}
            onChange={(e) => set('checkOut', e.target.value)}
            className="bg-transparent outline-none text-gray-900 text-sm w-full"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 lg:w-36">
        <FiUsers className="text-primary-500 flex-shrink-0 text-lg" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Guests</label>
          <select
            value={form.guests}
            onChange={(e) => set('guests', e.target.value)}
            className="bg-transparent outline-none text-gray-900 text-sm w-full"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (<option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button type="submit" className="btn-primary px-8 py-3 rounded-xl text-base font-bold flex items-center gap-2 justify-center">
        <FiSearch /> Search
      </button>
    </form>
  );
}
