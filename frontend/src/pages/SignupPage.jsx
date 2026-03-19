import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(data);
      toast.success('Account created! Welcome to Vilstay 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1499696985442-fb744d0811e9?w=1200" alt="Village Resort" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/40" />
        <div className="absolute top-10 left-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
              <img src="/logo.png" alt="Vilstay Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span style={{display: 'none'}} className="font-extrabold text-[#c74d41] text-xl">v</span>
            </div>
          <span className="font-bold text-2xl tracking-wide text-white">vilstay</span>
        </div>
        <div className="absolute bottom-10 left-10 text-white">
          <div className="flex gap-4 mb-4">
            {['Heritage Villas', 'Eco Retreats', 'Luxury Stays'].map(t => (
              <span key={t} className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
          <p className="text-2xl font-bold">Discover India's Finest Stays</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white border border-gray-100">
              <img src="/logo.png" alt="Vilstay Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span style={{display: 'none'}} className="font-extrabold text-[#c74d41] text-xl">v</span>
            </div>
            <span className="font-bold text-2xl tracking-wide text-[#c74d41]">vilstay</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-400 mb-8">Join thousands of happy guests</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative"><FiUser className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="text" className="input-field pl-10" placeholder="John Doe" value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative"><FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} required /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone (Optional)</label>
              <div className="relative"><FiPhone className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="tel" className="input-field pl-10" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative"><FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Min 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3.5 text-gray-400">{showPw ? <FiEyeOff /> : <FiEye />}</button></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative"><FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="password" className="input-field pl-10" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} required /></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
