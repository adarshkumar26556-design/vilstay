const Review = require('../models/Review');
const Resort = require('../models/Resort');

const getResortReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ resort: req.params.resortId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { resort, rating, comment, title } = req.body;

    const existing = await Review.findOne({ user: req.user._id, resort });
    if (existing)
      return res.status(400).json({ message: 'You have already reviewed this resort' });

    const review = await Review.create({ user: req.user._id, resort, rating, comment, title });

    // Recalculate resort rating
    const reviews = await Review.find({ resort });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Resort.findByIdAndUpdate(resort, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const resortId = review.resort;
    await review.deleteOne();

    // Recalculate rating
    const reviews = await Review.find({ resort: resortId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Resort.findByIdAndUpdate(resortId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResortReviews, createReview, deleteReview };
