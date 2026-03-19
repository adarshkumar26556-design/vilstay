const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resort: { type: mongoose.Schema.Types.ObjectId, ref: 'Resort', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// One review per user per resort
reviewSchema.index({ user: 1, resort: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
