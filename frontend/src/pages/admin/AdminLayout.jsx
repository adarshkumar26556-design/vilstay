import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiList, FiBookOpen, FiLogOut, FiHome } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

const NAV = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/admin/resorts', icon: <MdHotel />, label: 'Resorts' },
  { to: '/admin/rooms', icon: <FiList />, label: 'Rooms' },
  { to: '/admin/bookings', icon: <FiBookOpen />, label: 'Bookings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="flex items-center gap-2 px-5 py-6 border-b border-gray-800">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><MdHotel size={16} /></div>
          <div>
            <div className="text-xs text-primary-400 font-semibold tracking-widest">Vilstay</div>
            <div className="text-sm font-bold">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }
            >
              {n.icon} {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <FiHome /> View Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all w-full text-left">
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="px-5 py-4 bg-gray-800/50">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
