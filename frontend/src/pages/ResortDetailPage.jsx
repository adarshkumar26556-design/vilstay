import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResortById, getResortReviews, createReview, getSimilarResorts } from '../services/api';
import ImageGallery from '../components/ImageGallery';
import RoomCard from '../components/RoomCard';
import StarRating from '../components/StarRating';
import ResortCard from '../components/ResortCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';

const AMENITY_ICONS = { 'Free WiFi': '📶', 'Swimming Pool': '🏊', 'Free Parking': '🅿️', 'Restaurant': '🍽️', 'Spa': '💆', 'Bar': '🍹', 'Air Conditioning': '❄️', 'Breakfast Included': '🍳', 'Nature Walks': '🌿', 'Campfire': '🔥', 'Children Play Area': '🛝', 'Room Service': '🛎️', 'Yoga Deck': '🧘', 'Trekking': '🥾', 'Water Sports': '🤿' };

export default function ResortDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [resort, setResort] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    Promise.all([getResortById(id), getResortReviews(id), getSimilarResorts(id)])
      .then(([rd, rv, sim]) => {
        setResort(rd.data.resort);
        setRooms(rd.data.rooms);
        setReviews(rv.data);
        setSimilar(sim.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      const { data } = await createReview({ resort: id, ...reviewForm });
      setReviews((prev) => [data, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner text="Loading resort details..." /></div>;
  if (!resort) return <div className="pt-24 text-center text-gray-400">Resort not found.</div>;

  const TABS = ['rooms', 'amenities', 'reviews', 'location'];

  return (
    <div className="pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-5">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/resorts" className="hover:text-primary-600">Resorts</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{resort.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize bg-primary-50 text-primary-700 mb-2 inline-block`}>{resort.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{resort.name}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiMapPin size={14} />
              <span>{resort.location?.address}, {resort.location?.city}, {resort.location?.state}</span>
            </div>
          </div>
          <StarRating rating={resort.rating} count={resort.reviewCount} size="lg" />
        </div>

        {/* Gallery */}
        <ImageGallery images={resort.images} name={resort.name} />

        {/* Tabs */}
        <div className="flex gap-1 mt-8 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 min-w-max px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-primary-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t === 'rooms' ? `Rooms (${rooms.length})` : t === 'reviews' ? `Reviews (${reviews.length})` : t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {/* Rooms */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              {rooms.length ? rooms.map((room) => <RoomCard key={room._id} room={room} resortId={id} />) : (
                <div className="card p-10 text-center text-gray-400"><MdHotel size={40} className="mx-auto mb-3 opacity-30" /><p>No rooms available currently.</p></div>
              )}
            </div>
          )}

          {/* Amenities */}
          {activeTab === 'amenities' && (
            <div className="card p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {resort.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-2xl">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-sm font-medium text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
              {/* Policies */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3"><FiClock className="text-primary-500" /><span className="text-sm text-gray-600">Check-in: {resort.policies?.checkIn}</span></div>
                  <div className="flex items-center gap-3"><FiClock className="text-primary-500" /><span className="text-sm text-gray-600">Check-out: {resort.policies?.checkOut}</span></div>
                  <div className="flex items-start gap-3"><FiPhone className="text-primary-500 mt-0.5" /><span className="text-sm text-gray-600">{resort.policies?.cancellation}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              {/* Add Review */}
              {user && (
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleReview} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 mr-2">Rating:</span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button type="button" key={n} onClick={() => setReviewForm((p) => ({ ...p, rating: n }))}>
                          <FaStar className={`text-xl transition-colors ${n <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-200'}`} />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Review title (optional)"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((p) => ({ ...p, title: e.target.value }))}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                      rows={3}
                      className="input-field resize-none"
                      required
                    />
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                      <FiSend size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
              {reviews.map((r) => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {getInitials(r.user?.name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{r.user?.name}</p>
                          <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      {r.title && <p className="font-medium text-gray-800 mt-2">{r.title}</p>}
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && !user && (
                <div className="card p-10 text-center text-gray-400">
                  <p>No reviews yet. <Link to="/login" className="text-primary-600 font-medium">Login</Link> to be the first to review!</p>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {activeTab === 'location' && (
            <div className="card p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6">Getting Here</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3"><FiMapPin className="text-primary-500 flex-shrink-0 mt-0.5" /><div><p className="font-medium text-gray-800">Address</p><p className="text-gray-500 text-sm">{resort.location?.address}, {resort.location?.city}, {resort.location?.state}, {resort.location?.country}</p></div></div>
                {resort.contactPhone && <div className="flex items-center gap-3"><FiPhone className="text-primary-500" /><a href={`tel:${resort.contactPhone}`} className="text-gray-600 hover:text-primary-600 text-sm">{resort.contactPhone}</a></div>}
                {resort.contactEmail && <div className="flex items-center gap-3"><FiMail className="text-primary-500" /><a href={`mailto:${resort.contactEmail}`} className="text-gray-600 hover:text-primary-600 text-sm">{resort.contactEmail}</a></div>}
              </div>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiMapPin size={36} className="mx-auto mb-2 text-primary-400" />
                  <p className="font-medium">{resort.name}</p>
                  <p className="text-sm">{resort.location?.city}, {resort.location?.state}</p>
                  <a href={`https://maps.google.com/?q=${resort.location?.lat},${resort.location?.lng}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2 px-4 mt-4 inline-block">Open in Google Maps</a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="card p-8 mt-6">
          <h2 className="font-bold text-xl text-gray-900 mb-4">About {resort.name}</h2>
          <p className="text-gray-600 leading-relaxed">{resort.description}</p>
        </div>

        {/* Similar Resorts */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-6">Similar Resorts in {resort.location?.state}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((r) => <ResortCard key={r._id} resort={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
