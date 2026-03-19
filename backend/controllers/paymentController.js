const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretHere',
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    // amount is in INR (so multiply by 100 for paise)
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ message: 'Some error occurred with Razorpay' });

    res.json({ ...order, keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Use string literal or direct variable
    const secret = process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretHere';

    // Verify signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Transaction is not legit!' });
    }

    // Payment is valid, update booking status
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.json({ message: 'Payment successful', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
