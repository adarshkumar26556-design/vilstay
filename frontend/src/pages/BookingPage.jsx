import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getRoomById, createBooking, createPaymentOrder, verifyPaymentSignature } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calcNights, today, tomorrow, imgFallback } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCalendar, FiUser, FiPhone, FiMail, FiMessageSquare, FiCheck } from 'react-icons/fi';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingPage() {
  const { roomId } = useParams();
  const [sp] = useSearchParams();
  const resortId = sp.get('resort');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    checkIn: today(),
    checkOut: tomorrow(),
    adults: 2,
    children: 0,
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || '',
    specialRequests: '',
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    getRoomById(roomId)
      .then((r) => setRoom(r.data))
      .catch(() => toast.error('Room not found'))
      .finally(() => setLoading(false));
  }, [roomId]);

  const nights = calcNights(form.checkIn, form.checkOut);
  const total = room ? nights * room.pricePerNight : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut) return toast.error('Select check-in and check-out dates');
    if (new Date(form.checkIn) >= new Date(form.checkOut)) return toast.error('Check-out must be after check-in');
    
    setSubmitting(true);
    try {
      // 1. Create booking in our DB (status 'pending')
      const { data: booking } = await createBooking({
        room: roomId,
        resort: resortId || room?.resort?._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: { adults: +form.adults, children: +form.children },
        guestDetails: { name: form.guestName, email: form.guestEmail, phone: form.guestPhone, specialRequests: form.specialRequests },
      });

      // 2. Load Razorpay
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) throw new Error('Razorpay SDK failed to load. Are you online?');

      // 3. Create Razorpay order on backend
      const { data: order } = await createPaymentOrder({
        amount: total,
        bookingId: booking._id,
      });

      // 4. Open Razorpay options
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Vilstay Resorts',
        description: `Booking for ${room.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 5. Verify payment
            const { data } = await verifyPaymentSignature({
              ...response,
              bookingId: booking._id
            });
            setSuccess(data.booking);
            toast.success('Payment successful & Booking confirmed! 🎉');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: form.guestName,
          email: form.guestEmail,
          contact: form.guestPhone
        },
        theme: {
          color: '#1a56db'
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      
      // If user closes modal, payment is failed/pending
      paymentObject.on('payment.failed', function (response){
         toast.error(response.error.description);
      });
      
      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner text="Loading room details..." /></div>;
  if (!room) return <div className="pt-24 text-center text-gray-400">Room not found.</div>;

  // ... (Success Screen and Form remain similar)
  // Success screen
  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck size={36} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your booking ID is <span className="font-bold text-primary-600">{success.bookingId}</span></p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Resort</span><span className="font-medium">{success.resort?.name || room.resort?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Room</span><span className="font-medium">{room.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Check-in</span><span className="font-medium">{new Date(success.checkIn).toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Check-out</span><span className="font-medium">{new Date(success.checkOut).toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Nights</span><span className="font-medium">{success.nights}</span></div>
            <div className="flex justify-between text-sm font-bold text-primary-600 border-t border-gray-200 pt-2 mt-2"><span>Paid via Razorpay</span><span>{formatPrice(success.totalAmount)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="btn-primary flex-1">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Stay details */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><FiCalendar className="text-primary-500" /> Stay Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in Date</label>
                  <input type="date" className="input-field" value={form.checkIn} min={today()} onChange={(e) => set('checkIn', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-out Date</label>
                  <input type="date" className="input-field" value={form.checkOut} min={form.checkIn} onChange={(e) => set('checkOut', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Adults</label>
                  <select className="input-field" value={form.adults} onChange={(e) => set('adults', e.target.value)}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Children</label>
                  <select className="input-field" value={form.children} onChange={(e) => set('children', e.target.value)}>
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Child{n!==1?'ren':''}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Guest details */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><FiUser className="text-primary-500" /> Guest Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative"><FiUser className="absolute left-3 top-3.5 text-gray-400" /><input type="text" className="input-field pl-10" value={form.guestName} onChange={(e) => set('guestName', e.target.value)} placeholder="Your full name" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <div className="relative"><FiMail className="absolute left-3 top-3.5 text-gray-400" /><input type="email" className="input-field pl-10" value={form.guestEmail} onChange={(e) => set('guestEmail', e.target.value)} placeholder="your@email.com" required /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <div className="relative"><FiPhone className="absolute left-3 top-3.5 text-gray-400" /><input type="tel" className="input-field pl-10" value={form.guestPhone} onChange={(e) => set('guestPhone', e.target.value)} placeholder="+91 98765 43210" required /></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests (Optional)</label>
                  <div className="relative"><FiMessageSquare className="absolute left-3 top-3 text-gray-400" /><textarea className="input-field pl-10 resize-none" rows={3} value={form.specialRequests} onChange={(e) => set('specialRequests', e.target.value)} placeholder="Dietary requirements, room preferences, special occasion..." /></div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base font-bold bg-[#1a56db] hover:bg-[#1546b4]">
              {submitting ? 'Please wait...' : `Pay ${formatPrice(total)} & Confirm Booking`}
            </button>
          </form>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-24">
              <div className="h-40 rounded-xl overflow-hidden mb-4">
                <img src={room.images?.[0]?.url || ''} alt={room.name} onError={imgFallback} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-900">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{room.type} Room · {room.resort?.name}</p>
              <p className="text-xs text-gray-400 mb-4">📍 {room.resort?.location?.city}</p>

              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Price per night</span><span className="font-medium">{formatPrice(room.pricePerNight)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nights</span><span className="font-medium">{nights}</span></div>
                <div className="flex justify-between font-bold text-base text-primary-600 border-t border-gray-100 pt-2.5 mt-1">
                  <span>Total Payable</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 text-blue-800 text-xs rounded-lg p-3 flex items-start flex-col gap-1">
                <span className="font-bold">Secured by Razorpay</span>
                <span className="opacity-80">100% secure encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
