const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      mapEmbedUrl: { type: String, default: '' },
    },
    images: [{ url: String, public_id: String }],
    amenities: [String],
    category: {
      type: String,
      enum: ['luxury', 'budget', 'boutique', 'heritage', 'eco'],
      default: 'boutique',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    policies: {
      checkIn: { type: String, default: '2:00 PM' },
      checkOut: { type: String, default: '11:00 AM' },
      cancellation: { type: String, default: 'Free cancellation up to 24 hours before check-in.' },
    },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resort', resortSchema);
