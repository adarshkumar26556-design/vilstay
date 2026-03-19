import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}! 👋`);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white border border-gray-100">
              <img src="/logo.png" alt="Vilstay Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span style={{display: 'none'}} className="font-extrabold text-[#c74d41] text-xl">v</span>
            </div>
            <span className="font-bold text-2xl tracking-wide text-[#c74d41]">vilstay</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Sign in to manage your bookings</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-primary-700 mb-2">Demo Accounts</p>
            <p className="text-gray-600">Admin: <span className="font-mono">admin@resort.com</span> / <span className="font-mono">admin123</span></p>
            <p className="text-gray-600">User: <span className="font-mono">user@resort.com</span> / <span className="font-mono">user123</span></p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=1200" alt="Village Resort" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/40" />
        <div className="absolute bottom-10 left-10 text-white">
          <p className="text-2xl font-bold mb-2">"An unforgettable heritage experience"</p>
          <p className="text-white/70">— Arjun K., Bangalore</p>
        </div>
      </div>
    </div>
  );
}
