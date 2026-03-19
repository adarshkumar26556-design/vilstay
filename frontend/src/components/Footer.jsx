import { Link } from 'react-router-dom';
import { MdHotel } from 'react-icons/md';
import { FiInstagram, FiFacebook, FiTwitter, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
                <img src="/logo.png" alt="Vilstay Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <span style={{display: 'none'}} className="font-extrabold text-[#c74d41] text-xl">v</span>
              </div>
              <div>
                <div className="text-white font-bold text-2xl tracking-wide">vilstay</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover handpicked heritage and nature resorts across India. Authentic experiences, unforgettable stays.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/resorts', 'All Resorts'], ['/resorts?category=heritage', 'Heritage Stays'], ['/resorts?category=eco', 'Eco Retreats'], ['/resorts?category=luxury', 'Luxury Villas']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[['/login', 'Login'], ['/signup', 'Sign Up'], ['/my-bookings', 'My Bookings'], ['/admin', 'Admin Panel']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="flex-shrink-0 mt-0.5 text-primary-400" />
                <span>Vilstay Estate, Coastal Karnataka, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone className="text-primary-400" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail className="text-primary-400" />
                <a href="mailto:stay@vilstay.in" className="hover:text-white transition-colors">stay@vilstay.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 Vilstay Resorts. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-400">Admin Login</Link>
            <p className="text-sm text-gray-500">Crafted with ♥ for heritage lovers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
