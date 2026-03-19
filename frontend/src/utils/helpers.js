// Format price in Indian Rupees
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Format date to readable string
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Calculate number of nights between two dates
export const calcNights = (checkIn, checkOut) => {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
};

// Get today's date in YYYY-MM-DD format
export const today = () => new Date().toISOString().split('T')[0];

// Get tomorrow's date in YYYY-MM-DD format
export const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// Booking status color
export const statusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'badge-green';
    case 'pending': return 'badge-yellow';
    case 'cancelled': return 'badge-red';
    default: return 'badge-blue';
  }
};

// Truncate text
export const truncate = (text, maxLen = 120) =>
  text?.length > maxLen ? text.slice(0, maxLen) + '...' : text;

// Get initials from name
export const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

// Image fallback
export const imgFallback = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
};
