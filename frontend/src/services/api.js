import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Resorts
export const getResorts = (params) => api.get('/resorts', { params });
export const getFeaturedResorts = () => api.get('/resorts/featured');
export const getResortById = (id) => api.get(`/resorts/${id}`);
export const getSimilarResorts = (id) => api.get(`/resorts/${id}/similar`);
export const createResort = (data) => api.post('/resorts', data);
export const updateResort = (id, data) => api.put(`/resorts/${id}`, data);
export const deleteResort = (id) => api.delete(`/resorts/${id}`);
export const uploadResortImage = (id, formData) =>
  api.post(`/resorts/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Rooms
export const getRoomsByResort = (resortId) => api.get(`/rooms/resort/${resortId}`);
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const checkAvailability = (params) => api.get('/rooms/availability', { params });
export const createRoom = (data) => api.post('/rooms', data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const getAllBookings = (params) => api.get('/bookings/all', { params });
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });

// Payments
export const createPaymentOrder = (data) => api.post('/payments/create-order', data);
export const verifyPaymentSignature = (data) => api.post('/payments/verify', data);

// Reviews
export const getResortReviews = (resortId) => api.get(`/reviews/resort/${resortId}`);
export const createReview = (data) => api.post('/reviews', data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;
