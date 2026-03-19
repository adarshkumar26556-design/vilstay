import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedResorts } from '../services/api';
import SearchBar from '../components/SearchBar';
import ResortCard from '../components/ResortCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowRight, FiAward, FiShield, FiHeart, FiStar } from 'react-icons/fi';
import { MdNaturePeople, MdHotel } from 'react-icons/md';

const CATEGORIES = [
  { id: 'heritage', label: 'Heritage', icon: '🏛️', desc: 'Ancient properties with rich history' },
  { id: 'eco', label: 'Eco Retreat', icon: '🌿', desc: 'Sustainable nature immersion' },
  { id: 'luxury', label: 'Luxury', icon: '✨', desc: 'Five-star experiences' },
  { id: 'boutique', label: 'Boutique', icon: '🏡', desc: 'Intimate curated stays' },
];

const WHY_US = [
  { icon: <FiAward className="text-primary-600 text-2xl" />, title: 'Curated Properties', desc: 'Only our handpicked resorts — no third-party listings.' },
  { icon: <FiShield className="text-primary-600 text-2xl" />, title: 'Secure Booking', desc: 'SSL-encrypted payments and instant confirmation.' },
  { icon: <FiHeart className="text-primary-600 text-2xl" />, title: 'Personal Touch', desc: 'Our team tailors your stay to your preferences.' },
  { icon: <FiStar className="text-primary-600 text-2xl" />, title: 'Top Rated', desc: '98% guest satisfaction across all properties.' },
];

export default function HomePage() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedResorts()
      .then((r) => setResorts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600"
            alt="Authentic Village Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <span className="inline-block bg-primary-600/20 backdrop-blur-sm text-primary-200 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-primary-400/30 mb-6">
            ✦ A VILSTAY EXPERIENCE
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Find Your Perfect<br /><span className="text-gradient bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">Heritage Escape</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium tracking-wide">
            Heritage Stays. Village Experiences. Intimate Moments.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center px-2">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[['4+', 'Resorts'], ['98%', 'Guest Satisfaction'], ['500+', 'Happy Guests'], ['5★', 'Average Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{num}</div>
                <div className="text-sm text-white/60">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs gap-2">
          <span>Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Each property type offers a unique experience tailored just for you.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/resorts?category=${cat.id}`}
                className="group card p-6 text-center hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{cat.label}</h3>
                <p className="text-xs text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED RESORTS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Resorts</h2>
              <p className="section-subtitle">Our most loved properties, handpicked for you.</p>
            </div>
            <Link to="/resorts" className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
              View all <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured resorts..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resorts.map((r) => <ResortCard key={r._id} resort={r} />)}
              {resorts.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <MdHotel size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No featured resorts yet. Seed the database to get started!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Vilstay?</h2>
            <p className="section-subtitle">We don't just book rooms — we create memories.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((w) => (
              <div key={w.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">{w.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="page-container text-center">
          <MdNaturePeople className="text-white/30 text-8xl mx-auto mb-4" />
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready for Your Next Escape?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">Browse all our properties and find the perfect stay for your next getaway with family or friends.</p>
          <Link to="/resorts" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-4 px-10 rounded-xl hover:bg-primary-50 transition-colors text-lg shadow-xl">
            Explore All Resorts <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
