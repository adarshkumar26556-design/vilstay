import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiSettings } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white border-2 border-transparent hover:border-white transition-all">
              <img src="/logo.png" alt="Vilstay Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span style={{display: 'none'}} className="font-extrabold text-[#c74d41] text-xl">v</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-xl font-bold tracking-wide ${scrolled || !isHome ? 'text-[#c74d41]' : 'text-white'}`}>vilstay</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/resorts" className={`text-sm font-medium hover:text-primary-600 transition-colors ${scrolled || !isHome ? 'text-gray-700' : 'text-white hover:text-blue-200'}`}>
              All Resorts
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 text-sm font-medium hover:text-primary-600 transition-colors ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <p className="px-4 py-2 text-xs text-gray-400 font-medium uppercase tracking-wider">Account</p>
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiBookmark className="text-gray-400" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FiSettings className="text-gray-400" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login removed as requested */}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <Link to="/resorts" className="block text-gray-700 font-medium py-2">All Resorts</Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="block text-gray-700 font-medium py-2">My Bookings</Link>
                {isAdmin && <Link to="/admin" className="block text-gray-700 font-medium py-2">Admin Panel</Link>}
                <button onClick={handleLogout} className="block text-red-500 font-medium py-2 w-full text-left">Logout</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                {/* Login removed as requested */}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
