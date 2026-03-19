const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    resort: { type: mongoose.Schema.Types.ObjectId, ref: 'Resort', required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['AC', 'Non-AC', 'Deluxe', 'Suite', 'Villa', 'Cottage'],
      required: true,
    },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 1 },
    },
    pricePerNight: { type: Number, required: true },
    description: { type: String, default: '' },
    amenities: [String],
    images: [{ url: String, public_id: String }],
    totalRooms: { type: Number, default: 1 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
